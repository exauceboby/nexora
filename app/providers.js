'use client';

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/lib/redux/store';
import NexoraAssistant from '@/components/NexoraAssistant';

export default function Providers({ children }) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    window.__NEXORA_STORE__ = storeRef.current;
    return () => {
      if (window.__NEXORA_STORE__ === storeRef.current) {
        delete window.__NEXORA_STORE__;
      }
    };
  }, []);

  return (
    <Provider store={storeRef.current}>
      {children}
      <NexoraAssistant />
    </Provider>
  );
}
