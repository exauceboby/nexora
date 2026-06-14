'use client';

import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Globe2, LogIn, Mail, QrCode } from 'lucide-react';
import { sessionActions } from '@/lib/redux/slices';

const STORAGE_KEY = 'nexora_marketplace_v1';
const AUTH_KEY = 'nexora_auth_v1';

const footerLinks = [
  'Politiques et reglementations',
  'Mentions legales',
  'Regles de mise en vente des produits',
  'Droits de propriete intellectuelle',
  'Politique de confidentialite',
  "Conditions d'utilisation",
  "Respect de l'integrite",
];

function mergeUser(user, token) {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  const state = saved ? JSON.parse(saved) : {};
  const users = Array.isArray(state.users) ? state.users : [];
  const exists = users.some((item) => item.id === user.id);
  const nextUsers = exists ? users.map((item) => item.id === user.id ? { ...item, ...user } : item) : [user, ...users];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, users: nextUsers, currentUserId: user.id }));
  window.localStorage.setItem(AUTH_KEY, JSON.stringify({ userId: user.id, token, loggedAt: new Date().toISOString() }));
}

function ProviderIcon({ provider }) {
  const styles = {
    GOOGLE: 'text-[#4285f4]',
    FACEBOOK: 'text-[#1877f2]',
    LINKEDIN: 'text-[#0a66c2]',
  };

  return <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-lg font-black ${styles[provider]}`}>{provider[0]}</span>;
}

export default function LoginPage() {
  const dispatch = useDispatch();
  const identifierRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [language, setLanguage] = useState('fr');

  function finishAuth(payload) {
    mergeUser(payload.user, payload.token);
    dispatch(sessionActions.setSession({ userId: payload.user.id, role: payload.user.role, token: payload.token }));
    window.location.href = '/';
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: String(form.get('identifier') || '').trim().toLowerCase(),
        password: String(form.get('password') || ''),
      }),
    });
    const payload = await response.json();
    setLoading(false);
    if (!payload.success) {
      setError(payload.error || 'Connexion impossible.');
      return;
    }
    finishAuth(payload);
  }

  async function continueWithProvider(provider) {
    setError('');
    const identifier = identifierRef.current?.value?.trim().toLowerCase();
    if (!identifier) {
      setError(`Saisissez votre email ou telephone avant de continuer avec ${provider}.`);
      identifierRef.current?.focus();
      return;
    }

    setLoading(true);
    const response = await fetch('/api/auth/social', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, identifier }),
    });
    const payload = await response.json();
    setLoading(false);
    if (!payload.success) {
      setError(payload.error || `Connexion ${provider} impossible.`);
      return;
    }
    finishAuth(payload);
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <a href="/" aria-label="Accueil Nexora" className="nexora-logo-plate"><img src="/images/nexora-logo-full.png" alt="Nexora" className="h-9 w-auto" /></a>
          <div className="flex items-center gap-3">
            <label className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 sm:flex">
              <Globe2 className="h-4 w-4" />
              <select value={language} onChange={(event) => setLanguage(event.target.value)} className="bg-transparent font-bold outline-none">
                <option value="fr">Francais</option>
                <option value="en">English</option>
                <option value="sw">Swahili</option>
              </select>
            </label>
            <a href="/signup" className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/10">Inscription</a>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:py-16">
        <aside className="rounded-lg bg-[#07111f] p-8 text-white shadow-2xl shadow-blue-950/15 lg:p-10">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-300">Nexora</p>
          <h1 className="mt-5 max-w-lg text-4xl font-black leading-tight tracking-tight md:text-5xl">Connectez-vous ou creez un compte.</h1>
          <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-slate-300">
            Accedez a vos achats, ventes, demandes de devis, messages, paiements proteges, livraisons et litiges depuis un espace unique.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {['Commandes', 'Messages', 'Paiements'].map((item) => (
              <div key={item} className="rounded-lg border border-cyan-200/15 bg-white/5 p-4">
                <p className="text-sm font-black text-cyan-100">{item}</p>
                <p className="mt-1 text-xs font-semibold text-slate-400">Synchronise avec votre compte</p>
              </div>
            ))}
          </div>
        </aside>

        <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70 sm:p-8">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-600">Compte Nexora</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Se connecter</h2>
            </div>
            <LogIn className="h-9 w-9 text-cyan-600" />
          </div>

          <div className="space-y-3">
            {['GOOGLE', 'FACEBOOK', 'LINKEDIN'].map((provider) => (
              <button
                type="button"
                key={provider}
                onClick={() => continueWithProvider(provider)}
                className="flex h-14 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 text-sm font-black text-slate-950 transition hover:border-cyan-400 hover:bg-cyan-50"
              >
                <ProviderIcon provider={provider} />
                <span>Continuer avec {provider === 'GOOGLE' ? 'Google' : provider === 'FACEBOOK' ? 'Facebook' : 'LinkedIn'}</span>
                <span className="w-8" />
              </button>
            ))}
          </div>

          <div className="my-7 flex items-center gap-3 text-sm font-bold uppercase text-slate-500">
            <span className="h-px flex-1 bg-slate-200" />
            ou
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <label className="block text-xs font-black uppercase tracking-wide text-slate-600">Email ou telephone</label>
          <div className="mt-2 flex h-14 items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-100">
            <Mail className="h-5 w-5 text-slate-400" />
            <input ref={identifierRef} name="identifier" required placeholder="Saisissez votre email ou telephone" className="min-w-0 flex-1 bg-transparent font-bold text-slate-950 outline-none placeholder:text-slate-400" />
          </div>

          <label className="mt-5 block text-xs font-black uppercase tracking-wide text-slate-600">Mot de passe</label>
          <input name="password" type="password" required placeholder="Votre mot de passe" className="mt-2 h-14 w-full rounded-lg border border-slate-300 bg-white px-4 font-bold text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />

          {error && <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p>}

          <button disabled={loading} className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-700 px-4 text-sm font-black text-white shadow-lg shadow-blue-950/20 disabled:opacity-60">
            <LogIn className="h-4 w-4" /> {loading ? 'Connexion...' : 'Continuer'}
          </button>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm font-bold text-slate-600">
            <a href="/signup" className="text-cyan-700 hover:underline">Creer un compte</a>
            <button type="button" onClick={() => setQrOpen((value) => !value)} className="inline-flex items-center gap-2 hover:text-cyan-700">
              <QrCode className="h-4 w-4" /> Se connecter avec QR code
            </button>
          </div>

          {qrOpen && (
            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mx-auto grid h-28 w-28 grid-cols-5 gap-1 rounded bg-white p-2 shadow-inner">
                {Array.from({ length: 25 }).map((_, index) => (
                  <span key={index} className={index % 2 === 0 || [3, 7, 11, 16, 22].includes(index) ? 'bg-slate-950' : 'bg-white'} />
                ))}
              </div>
              <p className="mt-3 text-center text-xs font-bold text-slate-500">Scannez depuis l'application Nexora quand elle est connectee.</p>
            </div>
          )}
        </form>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 text-sm font-semibold text-slate-500 sm:px-6">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {footerLinks.map((item) => <a key={item} href="#" className="hover:text-cyan-700">{item}</a>)}
          </div>
          <p className="mt-5 text-center">© 2026 Nexora. Marketplace B2B/B2C, sourcing, vente, paiements et logistique.</p>
        </div>
      </footer>
    </main>
  );
}
