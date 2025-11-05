import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const LoadingFallback = () => (
  <div className="min-h-screen bg-brand-light-dark text-brand-text flex flex-col items-center justify-center p-4">
    <div className="relative animate-spin rounded-full h-16 w-16">
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-primary"></div>
    </div>
    <p className="mt-4 text-brand-gray">Loading...</p>
  </div>
);

root.render(
  <Suspense fallback={<LoadingFallback />}>
    <App />
  </Suspense>
);