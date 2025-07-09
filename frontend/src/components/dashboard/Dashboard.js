import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Analytics from './Analytics';
import DataUpload from './DataUpload';
import QueryHistory from './QueryHistory';
import Profile from './Profile';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen font-[Inter,sans-serif] flex bg-[#f7fafd]">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          onLogout={handleLogout}
        />
        {/* Page content */}
        <main className="flex-1 flex flex-col justify-start items-stretch py-4 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-[#e3e8ee] rounded-2xl shadow-sm p-6 flex-1"
              style={{ minHeight: '70vh' }}
            >
              <Routes>
                <Route path="/" element={<Analytics />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/upload" element={<DataUpload />} />
                <Route path="/history" element={<QueryHistory />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-blue-200 bg-opacity-60" />
        </div>
      )}
    </div>
  );
};

export default Dashboard; 