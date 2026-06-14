'use client';

import { createSlice, nanoid } from '@reduxjs/toolkit';

export const defaultServiceCatalog = [
  'Sourcing IA',
  'Correction bugs',
  'Support client',
  'Centre vendeur',
  'Paiement securise',
  'Livraison et logistique',
  'Upload images',
  'Verification KYC',
  'Signalement abus',
  'Remboursements et litiges',
  'Recherche image Nexora Lens',
  'Demande de devis RFQ',
  'Litiges et arbitrage',
];

export const initialUiState = {
  assistantOpen: false,
  bugPanelOpen: false,
  servicePanelOpen: false,
  lastBugStatus: '',
};

export const initialSessionState = {
  userId: '',
  role: 'VISITEUR',
  token: '',
  authenticated: false,
};

export const welcomeAiMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Bonjour, je suis l'assistant IA Nexora. Je peux aider pour le sourcing, les bugs, les vendeurs, les commandes, les paiements, la livraison, le profil, la conformite, les litiges et le support.",
  createdAt: new Date(0).toISOString(),
};

export const initialAiState = {
  mode: 'sourcing',
  loading: false,
  error: '',
  messages: [welcomeAiMessage],
};

export const initialBugsState = {
  reports: [],
};

export const initialServicesState = {
  services: defaultServiceCatalog,
  requests: [],
};

export function initialReduxState() {
  return {
    ui: { ...initialUiState },
    session: { ...initialSessionState },
    ai: { ...initialAiState, messages: [...initialAiState.messages] },
    bugs: { ...initialBugsState, reports: [] },
    services: { ...initialServicesState, services: [...defaultServiceCatalog], requests: [] },
  };
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: initialUiState,
  reducers: {
    toggleAssistant(state) {
      state.assistantOpen = !state.assistantOpen;
    },
    setAssistantOpen(state, action) {
      state.assistantOpen = action.payload;
    },
    toggleBugPanel(state) {
      state.bugPanelOpen = !state.bugPanelOpen;
    },
    setBugPanelOpen(state, action) {
      state.bugPanelOpen = action.payload;
    },
    toggleServicePanel(state) {
      state.servicePanelOpen = !state.servicePanelOpen;
    },
    setServicePanelOpen(state, action) {
      state.servicePanelOpen = action.payload;
    },
    setLastBugStatus(state, action) {
      state.lastBugStatus = action.payload;
    },
  },
});

const sessionSlice = createSlice({
  name: 'session',
  initialState: initialSessionState,
  reducers: {
    setSession(state, action) {
      return { ...state, ...action.payload, authenticated: Boolean(action.payload?.userId || action.payload?.token) };
    },
    clearSession() {
      return { userId: '', role: 'VISITEUR', token: '', authenticated: false };
    },
  },
});

const aiSlice = createSlice({
  name: 'ai',
  initialState: initialAiState,
  reducers: {
    setAiMode(state, action) {
      state.mode = action.payload;
    },
    addAiMessage: {
      reducer(state, action) {
        state.messages.push(action.payload);
      },
      prepare(message) {
        return { payload: { id: nanoid(), createdAt: new Date().toISOString(), ...message } };
      },
    },
    setAiLoading(state, action) {
      state.loading = action.payload;
    },
    setAiError(state, action) {
      state.error = action.payload;
    },
    clearAiMessages(state) {
      state.messages = state.messages.slice(0, 1);
      state.error = '';
    },
  },
});

const bugSlice = createSlice({
  name: 'bugs',
  initialState: initialBugsState,
  reducers: {
    addBugReport: {
      reducer(state, action) {
        state.reports.unshift(action.payload);
      },
      prepare(report) {
        return {
          payload: {
            id: nanoid(),
            status: 'OPEN',
            priority: report.priority || 'MEDIUM',
            createdAt: new Date().toISOString(),
            ...report,
          },
        };
      },
    },
    updateBugStatus(state, action) {
      const report = state.reports.find((item) => item.id === action.payload.id);
      if (report) report.status = action.payload.status;
    },
  },
});

const serviceSlice = createSlice({
  name: 'services',
  initialState: initialServicesState,
  reducers: {
    addServiceRequest: {
      reducer(state, action) {
        state.requests.unshift(action.payload);
      },
      prepare(request) {
        return {
          payload: {
            id: nanoid(),
            status: 'NEW',
            createdAt: new Date().toISOString(),
            ...request,
          },
        };
      },
    },
  },
});

export const uiActions = uiSlice.actions;
export const sessionActions = sessionSlice.actions;
export const aiActions = aiSlice.actions;
export const bugActions = bugSlice.actions;
export const serviceActions = serviceSlice.actions;

export const reducers = {
  ui: uiSlice.reducer,
  session: sessionSlice.reducer,
  ai: aiSlice.reducer,
  bugs: bugSlice.reducer,
  services: serviceSlice.reducer,
};
