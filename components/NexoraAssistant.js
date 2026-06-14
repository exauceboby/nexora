'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertTriangle, Bot, Bug, Headphones, Send, Sparkles, X } from 'lucide-react';
import { aiActions, bugActions, defaultServiceCatalog, serviceActions, uiActions } from '@/lib/redux/slices';

const modes = [
  ['sourcing', 'Sourcing'],
  ['bug', 'Bugs'],
  ['support', 'Support'],
  ['seller', 'Vendeur'],
  ['payment', 'Paiement'],
  ['delivery', 'Livraison'],
  ['orders', 'Commandes'],
  ['profile', 'Profil'],
  ['admin', 'Admin'],
];

const fieldClass = 'w-full rounded-lg border border-cyan-200/20 bg-[#0d1d34] px-3 py-3 text-sm font-bold text-white outline-none placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400';
const textareaClass = `${fieldClass} min-h-28 resize-y leading-6`;

export default function NexoraAssistant() {
  const dispatch = useDispatch();
  const { assistantOpen, bugPanelOpen, servicePanelOpen } = useSelector((state) => state.ui);
  const ai = useSelector((state) => state.ai);
  const session = useSelector((state) => state.session);
  const services = useSelector((state) => state.services.services);
  const serviceOptions = services?.length ? services : defaultServiceCatalog;
  const [message, setMessage] = useState('');
  const [bugForm, setBugForm] = useState({ title: '', module: 'SYSTEME', priority: 'MEDIUM', description: '' });
  const [serviceForm, setServiceForm] = useState({ service: serviceOptions[0], priority: 'NORMAL', details: '' });

  async function askAi(event) {
    event.preventDefault();
    const content = message.trim();
    if (!content) return;
    setMessage('');
    dispatch(aiActions.addAiMessage({ role: 'user', content }));
    dispatch(aiActions.setAiLoading(true));
    dispatch(aiActions.setAiError(''));
    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, context: ai.mode, role: session.role }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'IA indisponible');
      if (!payload.success) throw new Error(payload.error || 'IA indisponible');
      dispatch(aiActions.addAiMessage({ role: 'assistant', content: payload.answer }));
    } catch (error) {
      dispatch(aiActions.setAiError(error.message || "Impossible de joindre l'IA Nexora."));
    } finally {
      dispatch(aiActions.setAiLoading(false));
    }
  }

  async function submitBug(event) {
    event.preventDefault();
    dispatch(aiActions.setAiError(''));
    try {
      const report = {
        ...bugForm,
        title: bugForm.title.trim(),
        description: bugForm.description.trim(),
      };
      if (!report.title || !report.description) throw new Error('Titre et description du bug sont obligatoires.');
      const response = await fetch('/api/bugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error || 'Envoi du bug impossible.');
      dispatch(bugActions.addBugReport(payload.report));
      dispatch(aiActions.addAiMessage({ role: 'assistant', content: `Bug recu : ${payload.report.title}. Statut ${payload.report.status}. Priorite ${payload.report.priority}.` }));
      setBugForm({ title: '', module: 'SYSTEME', priority: 'MEDIUM', description: '' });
      dispatch(uiActions.setBugPanelOpen(false));
      dispatch(uiActions.setAssistantOpen(true));
    } catch (error) {
      dispatch(aiActions.setAiError(error.message || 'Envoi du bug impossible.'));
      dispatch(uiActions.setAssistantOpen(true));
    }
  }

  async function submitService(event) {
    event.preventDefault();
    dispatch(aiActions.setAiError(''));
    try {
      const request = {
        ...serviceForm,
        service: serviceForm.service || serviceOptions[0],
        details: serviceForm.details.trim(),
      };
      if (!request.details) throw new Error('Les details du service sont obligatoires.');
      const response = await fetch('/api/services/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error || 'Demande service impossible.');
      dispatch(serviceActions.addServiceRequest(payload.request));
      dispatch(aiActions.addAiMessage({ role: 'assistant', content: `Demande service creee : ${payload.request.service}. Statut ${payload.request.status}.` }));
      setServiceForm({ service: serviceOptions[0], priority: 'NORMAL', details: '' });
      dispatch(uiActions.setServicePanelOpen(false));
      dispatch(uiActions.setAssistantOpen(true));
    } catch (error) {
      dispatch(aiActions.setAiError(error.message || 'Demande service impossible.'));
      dispatch(uiActions.setAssistantOpen(true));
    }
  }

  return (
    <>
      <div className="fixed bottom-5 right-4 z-[110] flex flex-col gap-2">
        <button type="button" onClick={() => {
          dispatch(uiActions.setBugPanelOpen(!bugPanelOpen));
          dispatch(uiActions.setServicePanelOpen(false));
          dispatch(uiActions.setAssistantOpen(false));
        }} className="flex h-12 w-12 items-center justify-center rounded-full border border-rose-200/30 bg-rose-600 text-white shadow-2xl" aria-label="Signaler un bug">
          <Bug className="h-5 w-5" />
        </button>
        <button type="button" onClick={() => {
          dispatch(uiActions.setServicePanelOpen(!servicePanelOpen));
          dispatch(uiActions.setBugPanelOpen(false));
          dispatch(uiActions.setAssistantOpen(false));
        }} className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-200/30 bg-[#0b1728] text-cyan-200 shadow-2xl" aria-label="Demander un service">
          <Headphones className="h-5 w-5" />
        </button>
        <button type="button" onClick={() => {
          dispatch(uiActions.setAssistantOpen(!assistantOpen));
          dispatch(uiActions.setBugPanelOpen(false));
          dispatch(uiActions.setServicePanelOpen(false));
        }} className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-700 text-white shadow-2xl shadow-blue-950/30" aria-label="Assistant IA Nexora">
          <Bot className="h-6 w-6" />
        </button>
      </div>

      {assistantOpen && (
        <section className="fixed bottom-24 right-4 z-[130] flex max-h-[75vh] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-cyan-200/20 bg-[#07111f] text-white shadow-2xl sm:right-20 sm:w-[min(420px,calc(100vw-7rem))]">
          <div className="flex items-center justify-between border-b border-cyan-200/10 p-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">IA Nexora</p>
              <h2 className="font-black">Assistant systeme total</h2>
            </div>
            <button type="button" onClick={() => dispatch(uiActions.setAssistantOpen(false))} className="rounded-lg bg-white/10 p-2" aria-label="Fermer l'assistant"><X className="h-4 w-4" /></button>
          </div>

          <div className="flex gap-2 overflow-x-auto border-b border-cyan-200/10 p-3">
            {modes.map(([id, label]) => (
              <button key={id} type="button" onClick={() => dispatch(aiActions.setAiMode(id))} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-black ${ai.mode === id ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-slate-200'}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
            {ai.messages.map((item) => (
              <div key={item.id} className={`rounded-lg p-3 text-sm font-semibold leading-6 ${item.role === 'user' ? 'ml-8 bg-cyan-500 text-white' : 'mr-8 bg-white/10 text-slate-100'}`}>
                <pre className="whitespace-pre-wrap font-sans">{item.content}</pre>
              </div>
            ))}
            {ai.loading && <p className="text-sm font-bold text-cyan-200">Analyse IA en cours...</p>}
            {ai.error && <p className="rounded-lg bg-rose-500/10 p-3 text-sm font-bold text-rose-100">{ai.error}</p>}
          </div>

          <form onSubmit={askAi} className="border-t border-cyan-200/10 p-3">
            <div className="flex gap-2">
              <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Demander a l'IA Nexora" className="min-w-0 flex-1 rounded-lg border border-cyan-200/15 bg-white/10 px-3 py-2 text-sm font-bold text-white outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-400" />
              <button type="submit" aria-label="Envoyer a l'IA" className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-700 px-3 text-white"><Send className="h-4 w-4" /></button>
            </div>
          </form>
        </section>
      )}

      {bugPanelOpen && (
        <PanelShell title="Signaler un bug" icon={<AlertTriangle className="h-5 w-5 text-rose-200" />} onClose={() => dispatch(uiActions.setBugPanelOpen(false))}>
          <form onSubmit={submitBug} className="space-y-3">
            <input value={bugForm.title} onChange={(event) => setBugForm({ ...bugForm, title: event.target.value })} required placeholder="Titre du bug" className={fieldClass} />
            <select value={bugForm.module} onChange={(event) => setBugForm({ ...bugForm, module: event.target.value })} className={fieldClass}>
              {['SYSTEME', 'ACCUEIL', 'LOGIN', 'SIGNUP', 'MARKET', 'PANIER', 'PAIEMENT', 'LIVRAISON', 'VENDEUR', 'ADMIN'].map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={bugForm.priority} onChange={(event) => setBugForm({ ...bugForm, priority: event.target.value })} className={fieldClass}>
              {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((item) => <option key={item}>{item}</option>)}
            </select>
            <textarea value={bugForm.description} onChange={(event) => setBugForm({ ...bugForm, description: event.target.value })} required placeholder="Description du bug" className={textareaClass} />
            <button type="submit" className="w-full rounded-lg bg-rose-600 px-4 py-3 text-sm font-black text-white">Envoyer le bug</button>
          </form>
        </PanelShell>
      )}

      {servicePanelOpen && (
        <PanelShell title="Demander un service" icon={<Sparkles className="h-5 w-5 text-cyan-200" />} onClose={() => dispatch(uiActions.setServicePanelOpen(false))}>
          <form onSubmit={submitService} className="space-y-3">
            <select value={serviceForm.service} onChange={(event) => setServiceForm({ ...serviceForm, service: event.target.value })} className={fieldClass}>
              {serviceOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={serviceForm.priority} onChange={(event) => setServiceForm({ ...serviceForm, priority: event.target.value })} className={fieldClass}>
              {['NORMAL', 'URGENT', 'CRITICAL'].map((item) => <option key={item}>{item}</option>)}
            </select>
            <textarea value={serviceForm.details} onChange={(event) => setServiceForm({ ...serviceForm, details: event.target.value })} required placeholder="Details du service demande" className={textareaClass} />
            <button type="submit" className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-700 px-4 py-3 text-sm font-black text-white">Envoyer la demande</button>
          </form>
        </PanelShell>
      )}
    </>
  );
}

function PanelShell({ title, icon, onClose, children }) {
  return (
    <section className="fixed bottom-24 right-4 z-[130] max-h-[78vh] w-[min(480px,calc(100vw-2rem))] overflow-y-auto rounded-lg border border-cyan-200/20 bg-[#07111f] p-4 text-white shadow-2xl sm:right-20 sm:w-[min(480px,calc(100vw-7rem))]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-black">{title}</h2>
        </div>
        <button type="button" onClick={onClose} className="rounded-lg bg-white/10 p-2" aria-label={`Fermer ${title}`}><X className="h-4 w-4" /></button>
      </div>
      {children}
    </section>
  );
}
