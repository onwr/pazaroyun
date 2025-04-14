import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex space-x-7">
                <div className="hidden md:flex items-center space-x-1">
                  <Link
                    to="/admin"
                    className={`py-4 px-2 ${
                      isActive('/admin')
                        ? 'text-blue-500 border-b-4 border-blue-500'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Ana Sayfa
                  </Link>
                  <Link
                    to="/admin/categories"
                    className={`py-4 px-2 ${
                      isActive('/admin/categories')
                        ? 'text-blue-500 border-b-4 border-blue-500'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Kategoriler
                  </Link>
                  <Link
                    to="/admin/products"
                    className={`py-4 px-2 ${
                      isActive('/admin/products')
                        ? 'text-blue-500 border-b-4 border-blue-500'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Ürünler
                  </Link>
                  <Link
                    to="/admin/content"
                    className={`py-4 px-2 ${
                      isActive('/admin/content')
                        ? 'text-blue-500 border-b-4 border-blue-500'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    İçerik Yönetimi
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 