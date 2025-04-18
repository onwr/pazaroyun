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
import Header from './pages/admin/Header';
import { PageEditor } from './components/PageEditor';
import { PageList } from './components/PageList';
import { DynamicPage } from './components/DynamicPage';

const App = () => {
  return (
    <CampaignProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/pazaroyunadmin/login' element={<Login />} />
          <Route
            path='/pazaroyunadmin'
            element={
              localStorage.getItem('isAdmin') === 'true' ? (
                <AdminLayout />
              ) : (
                <Navigate to='/pazaroyunadmin/login' replace />
              )
            }
          >
            <Route index element={<Dashboard />} />
            <Route path='categories' element={<Categories />} />
            <Route path='products' element={<Products />} />
            <Route path='content' element={<Content />} />
            <Route path='header' element={<Header />} />
            <Route path="pages" element={<PageList />} />
            <Route path="pages/new" element={<PageEditor />} />
            <Route path="pages/edit/:id" element={<PageEditor />} />
          </Route>
          <Route path="/:slug" element={<DynamicPage />} />
        </Routes>
      </Router>
    </CampaignProvider>
  );
};

export default App;
