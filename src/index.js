import React from 'react';
import ReactDOM from 'react-dom/client';
import { LumelyProvider } from 'lumely-react';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <LumelyProvider apiKey={process.env.REACT_APP_LUMELY_API_KEY ?? ''}>
    <App />
  </LumelyProvider>
);