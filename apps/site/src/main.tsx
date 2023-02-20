import App from './app/App';
import { apolloClient } from './app/providers/apollo.client';

import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { ApolloProvider } from '@apollo/client';

import 'dayjs/locale/fr';
import { locale } from 'dayjs';
locale('fr');

const htmlRoot = window.document.documentElement;

const initTheme = localStorage.getItem('theme') === 'dark';
if (initTheme) htmlRoot.classList.add('dark');

const root = document.querySelector('#root');
if (!root) throw new Error('Root element not found');

const appRoot = ReactDOM.createRoot(root);
appRoot.render(
  <ApolloProvider client={apolloClient}>
    <StrictMode>
      <App />
    </StrictMode>
  </ApolloProvider>
);
