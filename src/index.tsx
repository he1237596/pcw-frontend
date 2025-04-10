import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'antd/dist/reset.css';
import './index.css';
import './i18n';
// createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
createRoot(document.getElementById('root')!).render(<App />);
