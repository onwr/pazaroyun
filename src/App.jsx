import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CampaignProvider } from './context/CampaignContext';
import Home from './pages/Home';
import AdminLayout from './layouts/AdminLayout';
import Categories from './pages/admin/Categories';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Content from './pages/admin/Content';
import Login from './pages/admin/Login';

const App = () => {
  return (
    <CampaignProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/admin/login' element={<Login />} />
          <Route
            path='/admin'
            element={
              localStorage.getItem('isAdmin') === 'true' ? (
                <AdminLayout />
              ) : (
                <Navigate to='/admin/login' replace />
              )
            }
          >
            <Route index element={<Dashboard />} />
            <Route path='categories' element={<Categories />} />
            <Route path='products' element={<Products />} />
            <Route path='content' element={<Content />} />
          </Route>
        </Routes>
      </Router>
    </CampaignProvider>
  );
};

export default App;
