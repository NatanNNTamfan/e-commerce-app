import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, setIsAuthenticated, user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl">
          Aplikasi Informasi Barang
        </Link>
        <div className="flex items-center">
          {isAuthenticated ? (
            <>
              {user.role === 'consumer' && (
                <Link to="/consumer" className="px-4">
                  Consumer
                </Link>
              )}
              {user.role === 'cashier' && (
                <Link to="/cashier" className="px-4">
                  Cashier
                </Link>
              )}
              {user.role === 'warehouse' && (
                <Link to="/warehouse" className="px-4">
                  Warehouse
                </Link>
              )}
              {user.role === 'supplier' && (
                <Link to="/supplier" className="px-4">
                  Supplier
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="px-4">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded ml-4">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4">
                Login
              </Link>
              <Link to="/register" className="bg-blue-500 px-4 py-2 rounded">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;