/**
 * D1-backed data access layer for Linguafly articles.
 *
 * Pure access layer: no framework imports (Next.js / itty-router) so the same
 * code runs in Next.js route handlers (OpenNext) and in the standalone
 * Worker entrypoint (src/index.ts). Caching is Cloudflare-native:
 * read-through KV cache (when bound) plus `ctx.waitUntil` for non-blocking
 * writes; handlers add `Cache-Control` headers for the CDN.
 *
 * D1 is the serving source of truth for article HTML. Do not embed article
 * bodies in the Worker bundle.
 */

import { compareCourseUnitArticles } from "@/lib/content/course-unit-order";
import { articleContentHash } from "@/lib/db/article-hash";
import { getArticleOgImagePath } from "@/lib/seo/og-images";

export interface CloudflareEmailBinding {
  send(message: {
    to: string;
    from: string;
    subject: string;
    text: string;
    html?: string;
  }): Promise<{ messageId: string }>;
}

export interface CloudflareEnv {
  DB: D1Database;
  /** Read-only course content database; learner data remains in DB. */
  COURSE_DB?: D1Database;
  /** Dedicated database for courses, exercises, vocabulary and learner progress. */
  LEARNING_DB?: D1Database;
  EMAIL?: CloudflareEmailBinding;
  EMAIL_TEST_TOKEN?: string;
  CACHE?: KVNamespace;
  SEARCH_INDEX?: KVNamespace;
  ARTICLES_BUCKET?: R2Bucket;
  ANALYTICS?: AnalyticsEngineDataset;
  ARTICLES_API_KEY?: string;
  ENVIRONMENT?: string;
}

/** Subset of ExecutionContext used for non-blocking cache maintenance. */
export interface WaitUntilContext {
  waitUntil(promise: Promise<unknown>): void;
}

export interface ArticleFaq {
  question: string;
  answer: string;
}

export interface ArticleRecord {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  content: string;
  category: string;
  level?: string | null;
  views?: number;
  likes?: number;
  is_published?: number | boolean;
  created_at?: string;
  updated_at?: string;
  excerpt?: string | null;
  author?: string | null;
  read_time?: string | null;
  faqs?: string | null;
  featured?: number | boolean | null;
  image?: string | null;
  alt?: string | null;
  related_routes?: string | null;
  canonical?: string | null;
  content_hash?: string | null;
}

export interface ArticleInput {
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  content: string;
  category: string;
  level?: string;
  tags?: string[];
  author?: string;
  readTime?: string;
  faqs?: ArticleFaq[];
  featured?: boolean;
  image?: string;
  alt?: string;
  relatedRoutes?: string[];
  canonical?: string;
  publishedAt?: string;
  updatedAt?: string;
  isPublished?: boolean;
}

export interface ArticleListResult {
  articles: ArticleRecord[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ArticleListFilter {
  page?: number;
  limit?: number;
  category?: string;
  categories?: string[];
  author?: string;
  /** Course hubs: unit 1 theory, unit 1 exercises, unit 2 theory, … */
  order?: "recent" | "course-units";
}

export interface SitemapArticleEntry {
  slug: string;
  category: string;
  created_at?: string | null;
  updated_at?: string | null;
  image?: string | null;
}

export interface ArticleSearchHit {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
  alt?: string;
}

export interface ArticleSearchResult {
  hits: ArticleSearchHit[];
  total: number;
}

export interface BatchImportResult {
  success: boolean;
  batchNumber: number;
  count: number;
  failed: number;
}

const ARTICLE_CACHE_TTL_SECONDS = 86400; // 24h, per README.CLOUDFLARE.md
const LIST_CACHE_TTL_SECONDS = 3600; // 1h, per README.CLOUDFLARE.md
const MAX_BATCH_SIZE = 1000; // keep in sync with wrangler.toml BATCH_SIZE

export const ARTICLE_LIST_COLUMNS = [
  "id",
  "slug",
  "title",
  "description",
  "excerpt",
  "category",
  "level",
  "views",
  "likes",
  "created_at",
  "updated_at",
  "author",
  "read_time",
  "featured",
  "image",
  "alt",
  "canonical",
  "is_published",
].join(", ");

const UPSERT_ARTICLE_SQL = `INSERT INTO articles (
  slug, title, description, content, category, level,
  excerpt, author, read_time, faqs, featured, image, alt,
  related_routes, canonical, created_at, updated_at, is_published, content_hash
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT(category, slug) DO UPDATE SET
  title = excluded.title,
  description = excluded.description,
  content = excluded.content,
  category = excluded.category,
  level = excluded.level,
  excerpt = excluded.excerpt,
  author = excluded.author,
  read_time = excluded.read_time,
  faqs = excluded.faqs,
  featured = excluded.featured,
  image = excluded.image,
  alt = excluded.alt,
  related_routes = excluded.related_routes,
  canonical = excluded.canonical,
  created_at = COALESCE(excluded.created_at, articles.created_at),
  updated_at = excluded.updated_at,
  is_published = excluded.is_published,
  content_hash = excluded.content_hash`;

function jsonText(value: unknown): string | null {
  if (value == null) return null;
  return JSON.stringify(value);
}

export function articleUpsertBindings(article: ArticleInput): unknown[] {
  const publishedAt = article.publishedAt ?? null;
  const updatedAt = article.updatedAt ?? article.publishedAt ?? null;
  return [
    article.slug,
    article.title,
    article.description ?? null,
    article.content,
    article.category,
    article.level ?? null,
    article.excerpt ?? article.description ?? null,
    article.author ?? null,
    article.readTime ?? null,
    jsonText(article.faqs ?? []),
    article.featured ? 1 : 0,
    article.image ?? null,
    article.alt ?? null,
    jsonText(article.relatedRoutes ?? []),
    article.canonical ?? null,
    publishedAt,
    updatedAt,
    article.isPublished === false ? 0 : 1,
    articleContentHash(article),
  ];
}

export function ftsKeywords(tags: string[] | undefined): string {
  return (tags ?? []).join(" ");
}

/**
 * Turn a user query into FTS5 MATCH tokens. Strips operators so callers cannot
 * inject MATCH syntax; each remaining term is quoted.
 */
export function ftsMatchQuery(
  raw: string,
  match: "any" | "all" = "any"
): string | null {
  const reserved = new Set(["and", "or", "not", "near"]);
  const tokens = raw
    .split(/\s+/)
    .map((token) => token.replace(/[^\p{L}\p{N}-]/gu, ""))
    .filter((token) => token.length >= 2 && !reserved.has(token.toLowerCase()))
    .slice(0, 12)
    .map((token) => `"${token.replace(/"/g, "")}"`);

  if (tokens.length === 0) return null;
  return tokens.join(match === "all" ? " AND " : " OR ");
}

function likePatterns(raw: string): string[] {
  return raw
    .split(/\s+/)
    .map((token) => token.replace(/[^\p{L}\p{N}-]/gu, ""))
    .filter((token) => token.length >= 2)
    .slice(0, 8)
    .map((token) => `%${token.toLowerCase()}%`);
}

function toSearchHit(row: ArticleRecord): ArticleSearchHit {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || row.description || "",
    date: row.created_at || "",
    readTime: row.read_time || "5 min",
    category: row.category,
    image: getArticleOgImagePath({
      image: row.image,
      category: row.category,
      slug: row.slug,
    }),
    alt: row.alt || undefined,
  };
}

class DatabaseClient {
  constructor(
    private env: CloudflareEnv,
    private ctx?: WaitUntilContext
  ) {}

  /** Schedule background work without blocking the response. */
  private waitUntil(promise: Promise<unknown>): void {
    if (this.ctx) {
      this.ctx.waitUntil(promise);
      return;
    }
    // Avoid unhandled rejections when no execution context is available.
    Promise.resolve(promise).catch((error) =>
      console.error("[DatabaseClient] background task failed:", error)
    );
  }

  private async cacheGet<T>(key: string): Promise<T | null> {
    if (!this.env.CACHE) return null;
    try {
      const cached = await this.env.CACHE.get(key);
      return cached ? (JSON.parse(cached) as T) : null;
    } catch (error) {
      console.error("[DatabaseClient] cache read failed:", error);
      return null;
    }
  }

  private cachePut(key: string, value: unknown, ttlSeconds: number): void {
    if (!this.env.CACHE) return;
    this.waitUntil(
      this.env.CACHE.put(key, JSON.stringify(value), {
        expirationTtl: ttlSeconds,
      })
    );
  }

  private cacheDelete(key: string): void {
    if (!this.env.CACHE) return;
    this.waitUntil(this.env.CACHE.delete(key));
  }

  private async getTags(articleId: number): Promise<string[]> {
    const { results } = await this.env.DB.prepare(
      "SELECT tag FROM article_tags WHERE article_id = ? ORDER BY tag"
    )
      .bind(articleId)
      .all();
    return (results || [])
      .map((row) => (row as { tag?: unknown }).tag)
      .filter((tag): tag is string => typeof tag === "string");
  }

  private publishedCategoryClause(
    categories?: string[]
  ): { sql: string; bindings: (string | number)[] } {
    if (!categories || categories.length === 0) {
      return { sql: "", bindings: [] };
    }
    const placeholders = categories.map(() => "?").join(", ");
    return {
      sql: ` AND category IN (${placeholders})`,
      bindings: categories,
    };
  }

  // Get single published article by slug (tags included).
  async getArticle(
    slug: string,
    category?: string
  ): Promise<(ArticleRecord & { tags: string[] }) | null> {
    const cacheKey = category
      ? `article:${slug}:${category}`
      : `article:${slug}`;
    const cached = await this.cacheGet<ArticleRecord & { tags: string[] }>(
      cacheKey
    );
    if (cached) return cached;

    const article = (
      category
        ? await this.env.DB.prepare(
            "SELECT * FROM articles WHERE slug = ? AND category = ? AND is_published = 1"
          )
            .bind(slug, category)
            .first()
        : await this.env.DB.prepare(
            "SELECT * FROM articles WHERE slug = ? AND is_published = 1"
          )
            .bind(slug)
            .first()
    ) as ArticleRecord | null;

    if (!article) return null;

    // Tags/cache are best-effort: if either fails, still return the article
    // (without tags) rather than surfacing a 500 to the caller.
    try {
      const result = { ...article, tags: await this.getTags(article.id) };
      this.cachePut(cacheKey, result, ARTICLE_CACHE_TTL_SECONDS);
      if (article.category) {
        this.cachePut(
          `article:${slug}:${article.category}`,
          result,
          ARTICLE_CACHE_TTL_SECONDS
        );
      }
      return result;
    } catch (error) {
      console.error("[DatabaseClient] getArticle tags/cache failed:", error);
      return { ...article, tags: [] };
    }
  }

  async getArticlesBySlugs(slugs: string[]): Promise<ArticleRecord[]> {
    const unique = [...new Set(slugs.filter(Boolean))].slice(0, 50);
    if (unique.length === 0) return [];
    const placeholders = unique.map(() => "?").join(", ");
    const { results } = await this.env.DB.prepare(
      `SELECT ${ARTICLE_LIST_COLUMNS} FROM articles WHERE is_published = 1 AND slug IN (${placeholders})`
    )
      .bind(...unique)
      .all();
    return (results || []) as unknown as ArticleRecord[];
  }

  // List published articles with pagination (content column excluded).
  async listArticles(page = 1, limit = 20): Promise<ArticleListResult> {
    return this.listArticlesFiltered({ page, limit });
  }

  async listArticlesFiltered(
    filter: ArticleListFilter = {}
  ): Promise<ArticleListResult> {
    const safePage = Math.max(1, Math.floor(filter.page || 1) || 1);
    const safeLimit = Math.min(Math.max(1, Math.floor(filter.limit || 20) || 20), 100);
    const offset = (safePage - 1) * safeLimit;
    const categories = filter.categories
      ?? (filter.category ? [filter.category] : undefined);
    const { sql: categorySql, bindings: categoryBindings } =
      this.publishedCategoryClause(categories);
    const authorSql = filter.author ? " AND author = ?" : "";
    const authorBindings: (string | number)[] = filter.author ? [filter.author] : [];

    const order = filter.order === "course-units" ? "course-units" : "recent";
    const cacheKey = `articles:page:${safePage}:limit:${safeLimit}:order:${order}:cat:${(categories ?? []).join(",")}:author:${filter.author ?? ""}`;
    const cached = await this.cacheGet<ArticleListResult>(cacheKey);
    if (cached) return cached;

    const where = `WHERE is_published = 1${categorySql}${authorSql}`;
    if (order === "course-units") {
      const { results } = await this.env.DB.prepare(
        `SELECT ${ARTICLE_LIST_COLUMNS} FROM articles ${where}`
      )
        .bind(...categoryBindings, ...authorBindings)
        .all();
      const sorted = ((results || []) as unknown as ArticleRecord[])
        .slice()
        .sort(compareCourseUnitArticles);
      const total = sorted.length;
      const result: ArticleListResult = {
        articles: sorted.slice(offset, offset + safeLimit),
        total,
        page: safePage,
        limit: safeLimit,
        pages: total > 0 ? Math.ceil(total / safeLimit) : 0,
      };
      this.cachePut(cacheKey, result, LIST_CACHE_TTL_SECONDS);
      return result;
    }

    const [{ results }, count] = await Promise.all([
      this.env.DB.prepare(
        `SELECT ${ARTICLE_LIST_COLUMNS} FROM articles ${where} ORDER BY featured DESC, created_at DESC LIMIT ? OFFSET ?`
      )
        .bind(...categoryBindings, ...authorBindings, safeLimit, offset)
        .all(),
      this.env.DB.prepare(
        `SELECT COUNT(*) as total FROM articles ${where}`
      )
        .bind(...categoryBindings, ...authorBindings)
        .first(),
    ]);

    const total = Number((count as { total?: unknown } | null)?.total ?? 0) || 0;
    const result: ArticleListResult = {
      articles: (results || []) as unknown as ArticleRecord[],
      total,
      page: safePage,
      limit: safeLimit,
      pages: total > 0 ? Math.ceil(total / safeLimit) : 0,
    };

    this.cachePut(cacheKey, result, LIST_CACHE_TTL_SECONDS);
    return result;
  }

  async listSitemapEntries(
    offset: number,
    limit: number,
    categories?: string[]
  ): Promise<SitemapArticleEntry[]> {
    const safeLimit = Math.min(Math.max(1, Math.floor(limit) || 1), 45_000);
    const safeOffset = Math.max(0, Math.floor(offset) || 0);
    const { sql: categorySql, bindings } = this.publishedCategoryClause(categories);
    const { results } = await this.env.DB.prepare(
      `SELECT slug, category, created_at, updated_at, image FROM articles WHERE is_published = 1${categorySql} ORDER BY created_at DESC LIMIT ? OFFSET ?`
    )
      .bind(...bindings, safeLimit, safeOffset)
      .all();
    return (results || []) as unknown as SitemapArticleEntry[];
  }

  async countPublished(categories?: string[]): Promise<number> {
    const { sql: categorySql, bindings } = this.publishedCategoryClause(categories);
    const result = (await this.env.DB.prepare(
      `SELECT COUNT(*) as count FROM articles WHERE is_published = 1${categorySql}`
    )
      .bind(...bindings)
      .first()) as { count?: unknown } | null;
    return Number(result?.count ?? 0) || 0;
  }

  // Search published articles by category and/or level.
  async searchArticles(
    category?: string,
    level?: string,
    limit = 50
  ): Promise<ArticleRecord[]> {
    const safeLimit = Math.min(Math.max(1, Math.floor(limit) || 50), 100);
    let query = `SELECT ${ARTICLE_LIST_COLUMNS} FROM articles WHERE is_published = 1`;
    const bindings: (string | number)[] = [];

    if (category) {
      query += " AND category = ?";
      bindings.push(category);
    }

    if (level) {
      query += " AND level = ?";
      bindings.push(level);
    }

    query += " ORDER BY created_at DESC LIMIT ?";
    bindings.push(safeLimit);

    const { results } = await this.env.DB.prepare(query)
      .bind(...bindings)
      .all();
    return (results || []) as unknown as ArticleRecord[];
  }

  async searchPublishedText(options: {
    query: string;
    match?: "any" | "all";
    category?: string;
    categories?: string[];
    limit?: number;
    offset?: number;
  }): Promise<ArticleSearchResult> {
    const limit = Math.min(Math.max(options.limit ?? 24, 1), 100);
    const offset = Math.max(options.offset ?? 0, 0);
    const match = options.match === "all" ? "all" : "any";
    const categories =
      options.categories ?? (options.category && options.category !== "all"
        ? [options.category]
        : undefined);

    const raw = options.query.trim();
    if (!raw) {
      const listed = await this.listArticlesFiltered({
        page: Math.floor(offset / limit) + 1,
        limit,
        categories,
        category: categories ? undefined : options.category,
      });
      return {
        hits: listed.articles.map(toSearchHit),
        total: listed.total,
      };
    }

    const ftsQuery = ftsMatchQuery(raw, match);
    if (!ftsQuery) {
      return { hits: [], total: 0 };
    }

    try {
      return await this.searchFts(ftsQuery, categories, limit, offset);
    } catch (error) {
      console.error("[DatabaseClient] FTS search failed, falling back to LIKE:", error);
      return this.searchLike(raw, match, categories, limit, offset);
    }
  }

  private async searchFts(
    matchQuery: string,
    categories: string[] | undefined,
    limit: number,
    offset: number
  ): Promise<ArticleSearchResult> {
    const { sql: categorySql, bindings: categoryBindings } =
      this.publishedCategoryClause(categories);
    const where = `WHERE articles_fts MATCH ? AND a.is_published = 1${categorySql.replace(
      " AND category IN",
      " AND a.category IN"
    )}`;
    const bindings = [matchQuery, ...categoryBindings];

    const [{ results }, count] = await Promise.all([
      this.env.DB.prepare(
        `SELECT a.id, a.slug, a.title, a.description, a.excerpt, a.category, a.level,
                a.created_at, a.updated_at, a.author, a.read_time, a.image, a.alt
         FROM articles_fts
         INNER JOIN articles a
           ON a.slug = articles_fts.slug AND a.category = articles_fts.category
         ${where}
         ORDER BY bm25(articles_fts)
         LIMIT ? OFFSET ?`
      )
        .bind(...bindings, limit, offset)
        .all(),
      this.env.DB.prepare(
        `SELECT COUNT(*) as total
         FROM articles_fts
         INNER JOIN articles a
           ON a.slug = articles_fts.slug AND a.category = articles_fts.category
         ${where}`
      )
        .bind(...bindings)
        .first(),
    ]);

    const total = Number((count as { total?: unknown } | null)?.total ?? 0) || 0;
    return {
      hits: ((results || []) as unknown as ArticleRecord[]).map(toSearchHit),
      total,
    };
  }

  private async searchLike(
    raw: string,
    match: "any" | "all",
    categories: string[] | undefined,
    limit: number,
    offset: number
  ): Promise<ArticleSearchResult> {
    const patterns = likePatterns(raw);
    if (patterns.length === 0) return { hits: [], total: 0 };

    const { sql: categorySql, bindings: categoryBindings } =
      this.publishedCategoryClause(categories);
    const tokenClause = (alias: string) =>
      `(LOWER(COALESCE(${alias}.title, '')) LIKE ? OR LOWER(COALESCE(${alias}.excerpt, '')) LIKE ? OR LOWER(COALESCE(${alias}.description, '')) LIKE ?)`;

    const perToken = patterns.map(() => tokenClause("articles"));
    const joined = match === "all" ? perToken.join(" AND ") : perToken.join(" OR ");
    const where = `WHERE is_published = 1${categorySql} AND (${joined})`;
    const likeBindings = patterns.flatMap((pattern) => [pattern, pattern, pattern]);
    const bindings = [...categoryBindings, ...likeBindings];

    const [{ results }, count] = await Promise.all([
      this.env.DB.prepare(
        `SELECT ${ARTICLE_LIST_COLUMNS} FROM articles ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`
      )
        .bind(...bindings, limit, offset)
        .all(),
      this.env.DB.prepare(
        `SELECT COUNT(*) as total FROM articles ${where}`
      )
        .bind(...bindings)
        .first(),
    ]);

    const total = Number((count as { total?: unknown } | null)?.total ?? 0) || 0;
    return {
      hits: ((results || []) as unknown as ArticleRecord[]).map(toSearchHit),
      total,
    };
  }

  async getRelatedByTags(
    currentSlug: string,
    tags: string[],
    limit = 3,
    categories?: string[]
  ): Promise<ArticleRecord[]> {
    const uniqueTags = [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))].slice(0, 20);
    if (uniqueTags.length === 0) return [];
    const tagPlaceholders = uniqueTags.map(() => "?").join(", ");
    const { sql: categorySql, bindings: categoryBindings } =
      this.publishedCategoryClause(categories);
    const safeLimit = Math.min(Math.max(1, limit), 20);
    const { results } = await this.env.DB.prepare(
      `SELECT DISTINCT ${ARTICLE_LIST_COLUMNS.split(", ").map((col) => `a.${col}`).join(", ")}
       FROM articles a
       INNER JOIN article_tags t ON t.article_id = a.id
       WHERE a.is_published = 1 AND a.slug != ?${categorySql.replace(" AND category IN", " AND a.category IN")}
         AND t.tag IN (${tagPlaceholders})
       ORDER BY a.created_at DESC
       LIMIT ?`
    )
      .bind(currentSlug, ...categoryBindings, ...uniqueTags, safeLimit)
      .all();
    return (results || []) as unknown as ArticleRecord[];
  }

  // Total number of published articles.
  async getArticleCount(): Promise<number> {
    return this.countPublished();
  }

  /**
   * Batch upsert articles (bulk import). Uses D1 `batch()` so all statements
   * run atomically; rows with an existing slug are updated instead of failing.
   */
  async insertArticlesBatch(
    articles: ArticleInput[],
    batchNumber: number
  ): Promise<BatchImportResult> {
    const batch = articles.slice(0, MAX_BATCH_SIZE);
    const statements: D1PreparedStatement[] = [
      this.env.DB.prepare(
        "INSERT INTO import_logs (batch_number, status, imported_count, error_count) VALUES (?, ?, ?, ?)"
      ).bind(batchNumber, "processing", batch.length, 0),
    ];

    for (const article of batch) {
      statements.push(
        this.env.DB.prepare(UPSERT_ARTICLE_SQL).bind(
          ...(articleUpsertBindings(article) as (string | number | null)[])
        )
      );

      statements.push(
        this.env.DB.prepare(
          `DELETE FROM article_tags WHERE article_id IN (SELECT id FROM articles WHERE slug = ? AND category = ?)`
        ).bind(article.slug, article.category)
      );

      for (const tag of article.tags ?? []) {
        statements.push(
          this.env.DB.prepare(
            `INSERT INTO article_tags (article_id, tag)
             SELECT id, ? FROM articles WHERE slug = ? AND category = ?`
          ).bind(tag, article.slug, article.category)
        );
      }

      statements.push(
        this.env.DB.prepare(
          "DELETE FROM articles_fts WHERE slug = ? AND category = ?"
        ).bind(article.slug, article.category)
      );
      statements.push(
        this.env.DB.prepare(
          `INSERT INTO articles_fts (slug, title, excerpt, description, keywords, category, content)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          article.slug,
          article.title,
          article.excerpt ?? article.description ?? "",
          article.description ?? "",
          ftsKeywords(article.tags),
          article.category,
          article.content
        )
      );
    }

    statements.push(
      this.env.DB.prepare(
        "UPDATE import_logs SET status = ?, completed_at = CURRENT_TIMESTAMP WHERE batch_number = ?"
      ).bind("completed", batchNumber)
    );

    try {
      const results = await this.env.DB.batch(statements);
      // Import log + upsert + tag cleanup + completion log per article batch.
      const upsertResults = results.slice(1, results.length - 1);
      const failed = upsertResults.filter((r) => !r.success).length;
      return { success: failed === 0, batchNumber, count: batch.length, failed };
    } catch (error) {
      await this.env.DB.prepare(
        "UPDATE import_logs SET status = ?, error_count = ? WHERE batch_number = ?"
      )
        .bind("failed", batch.length, batchNumber)
        .run();
      throw error;
    }
  }

  // Increment a metric counter (views/likes) for an article.
  async incrementMetrics(articleId: number, type: "views" | "likes"): Promise<void> {
    const column = type === "views" ? "views" : "likes";

    await this.env.DB.prepare(
      `UPDATE articles SET ${column} = ${column} + 1 WHERE id = ?`
    )
      .bind(articleId)
      .run();

    const article = (await this.env.DB.prepare(
      "SELECT slug, category FROM articles WHERE id = ?"
    )
      .bind(articleId)
      .first()) as { slug: string; category?: string } | null;

    // Invalidate the per-article cache; list pages refresh when their TTL expires.
    if (article) {
      this.cacheDelete(`article:${article.slug}`);
      if (article.category) {
        this.cacheDelete(`article:${article.slug}:${article.category}`);
      }
    }
  }
}

export { DatabaseClient };

/**
 * Resolve the Cloudflare env from the OpenNext context when running on
 * Cloudflare, or from the argument passed by the standalone Worker.
 */
export async function resolveCloudflareEnv(
  env?: CloudflareEnv
): Promise<{ env: CloudflareEnv; ctx?: WaitUntilContext }> {
  if (env) return { env };

  try {
    const mod = await import("@opennextjs/cloudflare");
    const { env: cfEnv, ctx } = await mod.getCloudflareContext({
      async: true,
    });
    if (cfEnv && (cfEnv as unknown as CloudflareEnv).DB) {
      return {
        env: cfEnv as unknown as CloudflareEnv,
        ctx: ctx as WaitUntilContext,
      };
    }
  } catch (error) {
    console.error("[DatabaseClient] Cloudflare context unavailable:", error);
  }

  throw new Error(
    "Cloudflare bindings unavailable: run under OpenNext/Wrangler or pass an env explicitly"
  );
}
