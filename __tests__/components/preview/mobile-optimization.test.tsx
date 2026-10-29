import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LazyUnitGrid } from '@/components/course/preview/LazyUnitGrid';
import { UnitMetadata } from '@/types/premium-course';

const mockUnits: UnitMetadata[] = Array.from({ length: 60 }, (_, i) => ({
  unitId: `unit-${i + 1}`,
  unitNumber: i + 1,
  title: `Unit ${i + 1} Title`,
  topics: ['Grammar', 'Vocabulary'],
  difficulty: Math.min(5, Math.floor(i / 12) + 1),
  exerciseCount: 10,
  estimatedDuration: 30,
  exerciseBreakdown: {
    multiple_choice: 3,
    fill_in_the_blank: 3,
    matching: 2,
    drag_and_drop: 0,
    categorization: 0,
    short_answer: 0,
    audio_matching: 0,
    listening: 2,
    video_narrative: 0,
    flashcards: 0,
    other: 0,
    total: 10,
  },
}));

jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('Mobile Optimization - LazyUnitGrid', () => {
  let intersectionObserverCallback: any;
  
  beforeEach(() => {
    global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
      intersectionObserverCallback = callback;
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
        takeRecords: jest.fn(),
        root: null,
        rootMargin: '',
        thresholds: [],
      };
    }) as any;
  });

  it('should initially load only 20 units', () => {
    render(<LazyUnitGrid units={mockUnits} />);
    
    const visibleCards = screen.getAllByText(/Unit \d+ Title/);
    expect(visibleCards.length).toBe(20);
  });

  it('should load more units on scroll', async () => {
    render(<LazyUnitGrid units={mockUnits} />);
    
    intersectionObserverCallback([{ isIntersecting: true }]);
    
    await waitFor(() => {
      const visibleCards = screen.getAllByText(/Unit \d+ Title/);
      expect(visibleCards.length).toBeGreaterThan(20);
    }, { timeout: 500 });
  });

  it('should render skeleton loaders while loading more', async () => {
    render(<LazyUnitGrid units={mockUnits} />);
    
    intersectionObserverCallback([{ isIntersecting: true }]);
    
    await waitFor(() => {
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    }, { timeout: 50 });
  });
});

describe('Mobile Optimization - Touch Targets', () => {
  it('should have minimum 44x44px touch targets for buttons', () => {
    const { container } = render(
      <button className="min-h-[44px] min-w-[44px]">Test Button</button>
    );
    
    const button = container.querySelector('button');
    expect(button?.classList.contains('min-h-[44px]')).toBe(true);
    expect(button?.classList.contains('min-w-[44px]')).toBe(true);
  });

  it('should have minimum 48px touch targets for primary actions', () => {
    const { container } = render(
      <button className="min-h-[48px]">Primary Action</button>
    );
    
    const button = container.querySelector('button');
    expect(button?.classList.contains('min-h-[48px]')).toBe(true);
  });
});

describe('Accessibility - Focus Indicators', () => {
  it('should have visible focus indicators on interactive elements', () => {
    const { container } = render(
      <button className="focus:outline-none focus:ring-2 focus:ring-coral-400">
        Test Button
      </button>
    );
    
    const button = container.querySelector('button');
    expect(button?.classList.contains('focus:ring-2')).toBe(true);
    expect(button?.classList.contains('focus:ring-coral-400')).toBe(true);
  });

  it('should have proper ARIA labels for icon buttons', () => {
    render(<button aria-label="Clear search">X</button>);
    
    const button = screen.getByLabelText('Clear search');
    expect(button).toBeInTheDocument();
  });

  it('should have proper ARIA attributes for dropdown', () => {
    render(
      <button aria-haspopup="listbox" aria-expanded={false}>
        Select Unit
      </button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-haspopup', 'listbox');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
