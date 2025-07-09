// import React, { useState, useRef, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { FiMenu, FiUser, FiLogOut, FiChevronDown, FiBell, FiSearch } from 'react-icons/fi';

// const Header = ({ onMenuClick, user, onLogout }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <header className="bg-white shadow-sm border-b border-gray-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Left side */}
//           <div className="flex items-center">
//             <button
//               onClick={onMenuClick}
//               className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
//             >
//               <FiMenu className="h-6 w-6" />
//             </button>
            
//             {/* Search bar */}
//             <div className="hidden md:flex ml-4 flex-1 max-w-lg">
//               <div className="relative w-full">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FiSearch className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search queries, insights..."
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Right side */}
//           <div className="flex items-center space-x-4">
//             {/* Notifications */}
//             <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 relative">
//               <FiBell className="h-6 w-6" />
//               <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-error-500"></span>
//             </button>

//             {/* User dropdown */}
//             <div className="relative" ref={dropdownRef}>
//               <button
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="flex items-center space-x-3 p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
//               >
//                 <div className="h-8 w-8 bg-gradient-primary rounded-full flex items-center justify-center">
//                   <span className="text-white font-medium text-sm">
//                     {user?.name?.charAt(0)?.toUpperCase() || 'U'}
//                   </span>
//                 </div>
//                 <div className="hidden md:block text-left">
//                   <p className="text-sm font-medium text-gray-900">{user?.name}</p>
//                   <p className="text-xs text-gray-500">{user?.email}</p>
//                 </div>
//                 <FiChevronDown className="h-4 w-4 text-gray-400" />
//               </button>

//               {/* Dropdown menu */}
//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
//                   <div className="px-4 py-2 border-b border-gray-100">
//                     <p className="text-sm font-medium text-gray-900">{user?.name}</p>
//                     <p className="text-xs text-gray-500">{user?.email}</p>
//                     {user?.emailVerified && (
//                       <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-800 mt-1">
//                         Email Verified
//                       </span>
//                     )}
//                   </div>
                  
//                   <a
//                     href="/dashboard/profile"
//                     className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     onClick={() => setIsDropdownOpen(false)}
//                   >
//                     <FiUser className="mr-3 h-4 w-4" />
//                     Profile
//                   </a>
                  
//                   <button
//                     onClick={() => {
//                       setIsDropdownOpen(false);
//                       onLogout();
//                     }}
//                     className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   >
//                     <FiLogOut className="mr-3 h-4 w-4" />
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header; 


import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiMenu, FiUser, FiLogOut, FiChevronDown, FiBell, FiSearch } from 'react-icons/fi';

const Header = ({ onMenuClick, user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            
            {/* Search bar */}
            <div className="hidden md:flex ml-4 flex-1 max-w-lg">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search queries, insights..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
                />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 relative transition-colors">
              <FiBell className="h-6 w-6" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <FiChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    {user?.emailVerified && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                        Email Verified
                      </span>
                    )}
                  </div>
                  
                  <a
                    href="/dashboard/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FiUser className="mr-3 h-4 w-4" />
                    Profile
                  </a>
                  
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onLogout();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <FiLogOut className="mr-3 h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;