import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';

const Login = ({ setIsAuthenticated, setUser }) => {
  const [users] = useLocalStorage('users', []);
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = users.find(
      (u) =>
        u.username.toLowerCase() === form.username.toLowerCase() && u.password === form.password
    );

    if (user) {
      localStorage.setItem('authToken', JSON.stringify(user));
      setIsAuthenticated(true);
      setUser(user);

      switch (user.role) {
        case 'consumer':
          navigate('/consumer');
          break;
        case 'cashier':
          navigate('/cashier');
          break;
        case 'warehouse':
          navigate('/warehouse');
          break;
        case 'supplier':
          navigate('/supplier');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/');
      }
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;