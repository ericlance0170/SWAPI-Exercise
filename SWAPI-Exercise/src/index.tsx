import React from 'react';
import ReactDom from 'react-dom/client';
import App from './app';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';

const root = ReactDom.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);