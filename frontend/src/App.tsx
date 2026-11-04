import React from 'react';
import type { AppProps } from 'next/app';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

export const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
