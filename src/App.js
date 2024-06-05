import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Consumer from './components/Consumer';
import Cashier from './components/Cashier';
import Warehouse from './components/Warehouse';
import Supplier from './components/Supplier';
import Admin from './components/Admin';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('authToken'));
    if (user) {
      setIsAuthenticated(true);
      setUser(user);
    }
  }, []);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} user={user} />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/consumer" element={<ProtectedRoute allowedRoles={['consumer']}><Consumer /></ProtectedRoute>} />
          <Route path="/cashier" element={<ProtectedRoute allowedRoles={['cashier']}><Cashier /></ProtectedRoute>} />
          <Route path="/warehouse" element={<ProtectedRoute allowedRoles={['warehouse']}><Warehouse /></ProtectedRoute>} />
          <Route path="/supplier" element={<ProtectedRoute allowedRoles={['supplier']}><Supplier /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute>} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
      <ToastContainer /> 
    </Router>
  );
};

export default App;