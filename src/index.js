import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';
import { ToastContainer } from 'react-toastify';

const defaultUsers = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'kasir', password: 'kasir123', role: 'cashier' },
  { username: 'gudang', password: 'gudang123', role: 'warehouse' },
  { username: 'supplier', password: 'supplier123', role: 'supplier' }
];

const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
const existingUsernames = existingUsers.map(user => user.username);

const mergedUsers = [...existingUsers, ...defaultUsers.filter(user => !existingUsernames.includes(user.username))];

localStorage.setItem('users', JSON.stringify(mergedUsers));

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
    <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
  </React.StrictMode>
);