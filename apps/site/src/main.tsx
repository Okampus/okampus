import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/App';

import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './app/providers/apollo.client';

import 'dayjs/locale/fr';
import { locale } from 'dayjs';
locale('fr');

const htmlRoot = window.document.documentElement;

const initTheme = localStorage.getItem('theme') === 'dark';
if (initTheme) htmlRoot.classList.add('dark');

const appRoot = ReactDOM.createRoot(document.querySelector('#root') as HTMLElement);
appRoot.render(
  <ApolloProvider client={apolloClient}>
    <StrictMode>
      <App />
    </StrictMode>
  </ApolloProvider>
);
