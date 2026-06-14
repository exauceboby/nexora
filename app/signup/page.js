'use client';

import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Globe2, Store, UserPlus } from 'lucide-react';
import { sessionActions } from '@/lib/redux/slices';

const STORAGE_KEY = 'nexora_marketplace_v1';
const AUTH_KEY = 'nexora_auth_v1';
const cities = ['Kinshasa', 'Lubumbashi', 'Goma', 'Bukavu', 'Kisangani', 'Bunia', 'Isiro', 'Mbuji-Mayi', 'Kananga', 'Matadi'];
const roles = ['ACHETEUR', 'VENDEUR', 'FOURNISSEUR', 'LIVREUR'];
const footerLinks = ['Centre vendeur', 'Demande de devis', 'Paiements securises', 'Livraison', 'Remboursements', 'Signaler un abus'];

function mergeUser(user, token) {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  const state = saved ? JSON.parse(saved) : {};
  const users = Array.isArray(state.users) ? state.users : [];
  const exists = users.some((item) => item.id === user.id);
  const nextUsers = exists ? users.map((item) => item.id === user.id ? { ...item, ...user } : item) : [user, ...users];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, users: nextUsers, currentUserId: user.id }));
  window.localStorage.setItem(AUTH_KEY, JSON.stringify({ userId: user.id, token, loggedAt: new Date().toISOString() }));
}

function ProviderButton({ provider, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-black text-slate-950 transition hover:border-cyan-400 hover:bg-cyan-50">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-base font-black text-cyan-700">{provider[0]}</span>
      {provider}
    </button>
  );
}

export default function SignupPage() {
  const dispatch = useDispatch();
  const emailRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('ACHETEUR');
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
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.get('name'),
        role: form.get('role'),
        email: form.get('email'),
        phone: form.get('phone'),
        city: form.get('city'),
        companyName: form.get('companyName'),
        address: form.get('address'),
        password: form.get('password'),
      }),
    });
    const payload = await response.json();
    setLoading(false);
    if (!payload.success) {
      setError(payload.error || 'Inscription impossible.');
      return;
    }
    finishAuth(payload);
  }

  async function continueWithProvider(provider) {
    setError('');
    const identifier = emailRef.current?.value?.trim().toLowerCase();
    if (!identifier) {
      setError(`Saisissez votre email avant de continuer avec ${provider}.`);
      emailRef.current?.focus();
      return;
    }

    setLoading(true);
    const response = await fetch('/api/auth/social', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, identifier, role }),
    });
    const payload = await response.json();
    setLoading(false);
    if (!payload.success) {
      setError(payload.error || `Inscription ${provider} impossible.`);
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
            <a href="/login" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-950">Connexion</a>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:py-16">
        <aside className="rounded-lg bg-[#07111f] p-8 text-white shadow-2xl shadow-blue-950/15 lg:p-10">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-300">Nouveau compte</p>
          <h1 className="mt-5 max-w-lg text-4xl font-black leading-tight tracking-tight md:text-5xl">Creez votre espace marketplace.</h1>
          <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-slate-300">
            Choisissez votre role pour ouvrir les outils adaptes : achat, vente, fourniture, livraison ou gestion professionnelle.
          </p>
          <div className="mt-8 grid gap-3">
            {roles.map((item) => (
              <button key={item} type="button" onClick={() => setRole(item)} className={`flex items-center justify-between rounded-lg border p-4 text-left font-black ${role === item ? 'border-cyan-300 bg-cyan-400 text-slate-950' : 'border-cyan-200/15 bg-white/5 text-slate-100'}`}>
                {item}
                <Store className="h-4 w-4" />
              </button>
            ))}
          </div>
        </aside>

        <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70 sm:p-8">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-600">Inscription Nexora</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Creer le compte</h2>
            </div>
            <UserPlus className="h-9 w-9 text-cyan-600" />
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            {['GOOGLE', 'FACEBOOK', 'LINKEDIN'].map((provider) => (
              <ProviderButton key={provider} provider={provider === 'GOOGLE' ? 'Google' : provider === 'FACEBOOK' ? 'Facebook' : 'LinkedIn'} onClick={() => continueWithProvider(provider)} />
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <input name="name" required placeholder="Nom complet" className="h-14 rounded-lg border border-slate-300 bg-white px-4 font-bold text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
            <select name="role" value={role} onChange={(event) => setRole(event.target.value)} className="h-14 rounded-lg border border-slate-300 bg-white px-4 font-bold text-slate-950 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100">
              {roles.map((item) => <option key={item}>{item}</option>)}
            </select>
            <input ref={emailRef} name="email" type="email" required placeholder="Email" className="h-14 rounded-lg border border-slate-300 bg-white px-4 font-bold text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
            <input name="phone" required placeholder="Telephone" className="h-14 rounded-lg border border-slate-300 bg-white px-4 font-bold text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
            <select name="city" className="h-14 rounded-lg border border-slate-300 bg-white px-4 font-bold text-slate-950 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100">{cities.map((city) => <option key={city}>{city}</option>)}</select>
            <input name="companyName" placeholder="Entreprise" className="h-14 rounded-lg border border-slate-300 bg-white px-4 font-bold text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
            <input name="address" placeholder="Adresse" className="h-14 rounded-lg border border-slate-300 bg-white px-4 font-bold text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
            <input name="password" type="password" required placeholder="Mot de passe" className="h-14 rounded-lg border border-slate-300 bg-white px-4 font-bold text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
          </div>

          {error && <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p>}

          <button disabled={loading} className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-700 px-4 text-sm font-black text-white shadow-lg shadow-blue-950/20 disabled:opacity-60">
            <UserPlus className="h-4 w-4" /> {loading ? 'Creation...' : 'Creer le compte'}
          </button>
        </form>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-4 gap-y-2 px-4 py-7 text-sm font-semibold text-slate-500 sm:px-6">
          {footerLinks.map((item) => <a key={item} href="#" className="hover:text-cyan-700">{item}</a>)}
        </div>
      </footer>
    </main>
  );
}
