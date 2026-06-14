'use client';

import { configureStore } from '@reduxjs/toolkit';
import { initialReduxState, reducers } from './slices';

const STORAGE_KEY = 'nexora_redux_state_v1';

function normalizeLoadedState(state) {
  const fallback = initialReduxState();
  if (!state || typeof state !== 'object') return fallback;

  const messages = Array.isArray(state.ai?.messages) && state.ai.messages.length
    ? state.ai.messages
    : fallback.ai.messages;
  const serviceCatalog = Array.isArray(state.services?.services) && state.services.services.length
    ? state.services.services
    : fallback.services.services;

  return {
    ui: {
      ...fallback.ui,
      ...(state.ui || {}),
      assistantOpen: false,
      bugPanelOpen: false,
      servicePanelOpen: false,
    },
    session: {
      ...fallback.session,
      ...(state.session || {}),
    },
    ai: {
      ...fallback.ai,
      ...(state.ai || {}),
      messages,
      loading: false,
      error: '',
    },
    bugs: {
      ...fallback.bugs,
      ...(state.bugs || {}),
      reports: Array.isArray(state.bugs?.reports) ? state.bugs.reports : [],
    },
    services: {
      ...fallback.services,
      ...(state.services || {}),
      services: serviceCatalog,
      requests: Array.isArray(state.services?.requests) ? state.services.requests : [],
    },
  };
}

function loadState() {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeLoadedState(JSON.parse(raw)) : undefined;
  } catch {
    return undefined;
  }
}

function saveState(state) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ai: { ...state.ai, loading: false, error: '' },
      bugs: state.bugs,
      services: state.services,
      session: state.session,
      ui: { ...state.ui, assistantOpen: false, bugPanelOpen: false, servicePanelOpen: false },
    }));
  } catch {
    // Local persistence should never block the application.
  }
}

export function makeStore() {
  const store = configureStore({
    reducer: reducers,
    preloadedState: loadState(),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
    }),
  });

  store.subscribe(() => saveState(store.getState()));
  return store;
}
