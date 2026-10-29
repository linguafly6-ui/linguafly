"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/sections/Navigation";
import { ArrowLeft, CheckCircle2, Clock3, LifeBuoy, MessageCircle, Plus, Send, Ticket, X } from "lucide-react";

type TicketRow = { id:string; subject:string; category:string; status:string; priority:string; created_at:string; last_message_at:string; last_message?:string };
type MessageRow = { id:string; sender_type:string; sender_name:string; message:string; created_at:string };
const statusLabels: Record<string,string> = { open:"Abierto", in_progress:"En curso", waiting_student:"Esperando tu respuesta", resolved:"Resuelto" };
const categoryLabels: Record<string,string> = { course:"Curso y ejercicios", billing:"Pagos y suscripción", technical:"Problema técnico", general:"Otra consulta" };
const dateLabel = (value:string) => new Date(value).toLocaleString("es-ES",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});

export default function SupportPage() {
  const [tickets,setTickets] = useState<TicketRow[]>([]);
  const [selected,setSelected] = useState<string|null>(null);
  const [messages,setMessages] = useState<MessageRow[]>([]);
  const [subject,setSubject] = useState("");
  const [category,setCategory] = useState("course");
  const [message,setMessage] = useState("");
  const [creating,setCreating] = useState(false);
  const [loading,setLoading] = useState(true);
  const [sending,setSending] = useState(false);
  const [error,setError] = useState("");
  const [notice,setNotice] = useState("");
  const loadTickets = useCallback(async () => {
    setLoading(true);
    try { const r=await fetch("/api/support-tickets",{cache:"no-store"}); const data=await r.json(); if(!r.ok) throw new Error(data.error||"No se pudo cargar el soporte."); setTickets(data.tickets||[]); }
    catch(e){setError(e instanceof Error?e.message:"Error de conexión.");} finally{setLoading(false);}
  },[]);
  const loadMessages = useCallback(async (id:string) => {
    try { const r=await fetch("/api/support-tickets?id="+encodeURIComponent(id),{cache:"no-store"}); const data=await r.json(); if(!r.ok) throw new Error(data.error||"No se pudo abrir el ticket."); setMessages(data.messages||[]); }
    catch(e){setError(e instanceof Error?e.message:"Error de conexión.");}
  },[]);
  useEffect(()=>{void loadTickets();},[loadTickets]);
  useEffect(()=>{if(selected) void loadMessages(selected);},[selected,loadMessages]);
  async function submit(e:React.FormEvent) {
    e.preventDefault(); setError(""); setNotice(""); setSending(true);
    try {
      const payload=creating?{subject,category,message}:{ticketId:selected,message};
      const r=await fetch("/api/support-tickets",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data=await r.json(); if(!r.ok) throw new Error(data.error||"No se pudo enviar el mensaje.");
      setMessage(""); setSubject(""); setCreating(false); setSelected(data.ticketId||selected); await loadTickets(); if(data.ticketId) await loadMessages(data.ticketId); setNotice("Mensaje enviado. Te responderemos desde este mismo espacio.");
    } catch(e){setError(e instanceof Error?e.message:"Error de conexión.");} finally{setSending(false);}
  }
  return <><Navigation/><main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6"><div className="mx-auto max-w-6xl">
    <Link href="/cuenta" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"><ArrowLeft size={16}/> Volver a mi cuenta</Link>
    <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-coral-600">Centro de ayuda</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">¿En qué podemos ayudarte?</h1><p className="mt-3 max-w-xl text-slate-600">Escríbenos y sigue la conversación desde aquí. Tus consultas quedan organizadas en tickets.</p></div><button onClick={()=>{setCreating(true);setSelected(null);setMessages([]);setError("");setNotice("");}} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white shadow-sm hover:bg-slate-800"><Plus size={18}/> Nueva consulta</button></div>
    {error&&<div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error} {error.includes("Inicia sesión")&&<Link className="font-bold underline" href="/cuenta">Iniciar sesión</Link>}</div>}
    {notice&&<div role="status" className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 size={18}/>{notice}</div>}
    <div className="mt-8 grid gap-5 lg:grid-cols-[350px_minmax(0,1fr)]">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-900">Tus consultas</h2><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{tickets.length}</span></div>
        {loading?<p className="p-6 text-sm text-slate-500">Cargando tus tickets…</p>:tickets.length===0?<div className="px-6 py-10 text-center"><LifeBuoy className="mx-auto text-slate-300" size={32}/><p className="mt-3 font-bold text-slate-800">Aún no tienes consultas</p><p className="mt-1 text-sm text-slate-500">Cuando nos escribas, aparecerán aquí.</p></div>:<div className="divide-y divide-slate-100">{tickets.map(t=><button key={t.id} onClick={()=>{setSelected(t.id);setCreating(false);setError("");setNotice("");}} className={`block w-full px-5 py-4 text-left transition hover:bg-slate-50 ${selected===t.id&&!creating?"bg-coral-50/60 border-l-2 border-coral-500":""}`}><div className="flex items-start justify-between gap-3"><p className="line-clamp-2 text-sm font-bold text-slate-900">{t.subject}</p><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${t.status==="resolved"?"bg-emerald-50 text-emerald-700":t.status==="waiting_student"?"bg-amber-50 text-amber-700":"bg-blue-50 text-blue-700"}`}>{statusLabels[t.status]||t.status}</span></div><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{t.last_message||categoryLabels[t.category]}</p><p className="mt-2 text-[11px] text-slate-400">{dateLabel(t.last_message_at||t.created_at)}</p></button>)}</div>}
      </section>
      <section className="flex min-h-[540px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {creating?<><div className="border-b border-slate-100 px-6 py-5"><div className="flex items-center justify-between"><div><h2 className="text-lg font-black text-slate-900">Nueva consulta</h2><p className="mt-1 text-sm text-slate-500">Cuéntanos qué necesitas y te ayudaremos.</p></div><button aria-label="Cerrar" onClick={()=>setCreating(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18}/></button></div></div><form onSubmit={submit} className="flex flex-1 flex-col gap-5 p-6"><label className="text-sm font-bold text-slate-700">Asunto<input required minLength={4} maxLength={140} value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Ej. Un ejercicio del curso A1 no funciona" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100"/></label><label className="text-sm font-bold text-slate-700">Tipo de consulta<select value={category} onChange={e=>setCategory(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-coral-400">{Object.entries(categoryLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label><label className="flex flex-1 flex-col text-sm font-bold text-slate-700">Mensaje<textarea required minLength={5} maxLength={5000} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Describe el problema con el mayor detalle posible…" className="mt-2 min-h-40 flex-1 resize-y rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100"/></label><div className="flex items-center justify-between gap-3"><span className="text-xs text-slate-400">{message.length}/5000</span><button disabled={sending} className="inline-flex items-center gap-2 rounded-xl bg-coral-600 px-5 py-3 font-bold text-white hover:bg-coral-700 disabled:opacity-60"><Send size={16}/>{sending?"Enviando…":"Enviar consulta"}</button></div></form></>:selected?<><div className="border-b border-slate-100 px-6 py-5"><p className="text-xs font-bold uppercase tracking-wider text-coral-600">Ticket de soporte</p><h2 className="mt-1 text-xl font-black text-slate-900">{tickets.find(t=>t.id===selected)?.subject||"Conversación"}</h2><p className="mt-1 text-sm text-slate-500">{statusLabels[tickets.find(t=>t.id===selected)?.status||"open"]||"Abierto"}</p></div><div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-5 sm:p-6">{messages.map(m=><div key={m.id} className={`flex ${m.sender_type==="student"?"justify-end":"justify-start"}`}><div className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm ${m.sender_type==="student"?"bg-slate-900 text-white":"border border-slate-200 bg-white text-slate-800"}`}><p className={`mb-1 text-xs font-bold ${m.sender_type==="student"?"text-slate-300":"text-coral-600"}`}>{m.sender_type==="student"?"Tú":"Equipo Linguafly"} · {dateLabel(m.created_at)}</p><p className="whitespace-pre-wrap text-sm leading-6">{m.message}</p></div></div>)}{messages.length===0&&<p className="py-10 text-center text-sm text-slate-500">Cargando conversación…</p>}</div>{tickets.find(t=>t.id===selected)?.status==="resolved"?<div className="border-t border-slate-100 p-5 text-sm text-slate-500">Este ticket está resuelto. Si necesitas más ayuda, crea una nueva consulta.</div>:<form onSubmit={submit} className="border-t border-slate-100 p-4 sm:p-5"><label htmlFor="reply" className="sr-only">Tu respuesta</label><div className="flex items-end gap-3"><textarea id="reply" required minLength={5} maxLength={5000} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Escribe tu respuesta…" rows={3} className="min-h-20 flex-1 resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100"/><button disabled={sending} aria-label="Enviar respuesta" className="inline-flex h-11 items-center gap-2 rounded-xl bg-coral-600 px-4 font-bold text-white hover:bg-coral-700 disabled:opacity-60"><Send size={16}/><span className="hidden sm:inline">{sending?"Enviando":"Enviar"}</span></button></div></form>}</>:<div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-coral-50 text-coral-600"><MessageCircle size={28}/></div><h2 className="mt-5 text-xl font-black text-slate-900">Estamos aquí para ayudarte</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Selecciona una consulta para continuar o abre un ticket nuevo. Nuestro equipo te responderá aquí.</p><button onClick={()=>setCreating(true)} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50"><Ticket size={16}/> Abrir una consulta</button><p className="mt-5 flex items-center gap-2 text-xs text-slate-400"><Clock3 size={14}/> Puedes volver cuando quieras para ver las respuestas.</p></div>}
      </section>
    </div>
  </div></main></>;
}