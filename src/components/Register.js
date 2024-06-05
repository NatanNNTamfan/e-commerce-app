import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';

const Register = () => {
  const [users, setUsers] = useLocalStorage('users', []);
  const [form, setForm] = useState({ username: '', password: '', role: 'consumer' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userExists = users.find((u) => u.username === form.username);
    if (userExists) {
      alert('User already exists');
    } else {
      setUsers([...users, form]);
      navigate('/login');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Register
      </h1>
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
        <div>
          <label htmlFor="role" className="block">
            Role:
          </label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
          >
            <option value="consumer">Consumer</option>
            <option value="cashier">Cashier</option>
            <option value="warehouse">Warehouse</option>
            <option value="supplier">Supplier</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;