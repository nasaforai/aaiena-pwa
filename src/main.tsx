import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Clean up service workers in development to prevent preview issues
if (import.meta.env.MODE !== "production" && "serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then(regs => regs.forEach(r => r.unregister()))
    .catch(console.warn);
  if ("caches" in window) {
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .catch(console.warn);
  }
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
