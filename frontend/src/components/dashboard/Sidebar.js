

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiBarChart2,
  FiUpload,
  FiClock,
  FiUser,
  FiLogOut,
  FiX,
  FiTrendingUp,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, onClose, user, onLogout }) => {
  const location = useLocation();
  const { user: authUser } = useAuth();

  const navigation = [
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: FiBarChart2,
      description: 'Ask questions and get insights',
    },
    {
      name: 'Data Upload',
      href: '/dashboard/upload',
      icon: FiUpload,
      description: 'Upload CSV or connect database',
    },
    {
      name: 'Query History',
      href: '/dashboard/history',
      icon: FiClock,
      description: 'View past queries and results',
    },
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: FiUser,
      description: 'Manage your account',
    },
  ];

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <>
      {/* Mobile sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#e3e8ee] shadow-none lg:hidden"
          >
            <div className="flex items-center justify-between h-16 px-6 border-b border-[#e3e8ee]">
              <div className="flex items-center">
                <FiTrendingUp className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold text-gray-800 font-[Inter,sans-serif]">Asklytics</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              {/* User profile */}
              <div className="px-6 py-4 border-b border-[#e3e8ee]">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-medium text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                    <p className="text-xs text-blue-500">{user?.email}</p>
                  </div>
                </div>
              </div>
              {/* Navigation */}
              <nav className="flex-1 px-4 py-4 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive: navActive }) =>
                      `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 font-[Inter,sans-serif] ` +
                      (isActive(item.href)
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-400'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700')
                    }
                    onClick={onClose}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive(item.href) ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'
                      }`}
                    />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
              {/* Logout button */}
              <div className="px-4 py-4 border-t border-[#e3e8ee]">
                <button
                  onClick={onLogout}
                  className="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 font-[Inter,sans-serif]"
                >
                  <FiLogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-400" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Desktop sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="hidden lg:flex lg:flex-shrink-0"
      >
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white border-r border-[#e3e8ee] shadow-none">
            {/* Logo */}
            <div className="flex items-center h-16 px-6 border-b border-[#e3e8ee]">
              <FiTrendingUp className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold text-gray-800 font-[Inter,sans-serif]">Asklytics</span>
            </div>
            {/* User profile */}
            <div className="px-6 py-4 border-b border-[#e3e8ee]">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 font-medium text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                  <p className="text-xs text-blue-500">{user?.email}</p>
                  {user?.emailVerified && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive: navActive }) =>
                    `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 font-[Inter,sans-serif] ` +
                    (isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-400'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700')
                  }
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive(item.href) ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'
                    }`}
                  />
                  {item.name}
                </NavLink>
              ))}
            </nav>
            {/* Logout button */}
            <div className="px-4 py-4 border-t border-[#e3e8ee]">
              <button
                onClick={onLogout}
                className="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 font-[Inter,sans-serif]"
              >
                <FiLogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-400" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
