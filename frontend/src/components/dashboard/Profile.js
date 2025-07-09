// import React, { useState } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { FiUser, FiMail, FiPhone, FiBuilding, FiEdit3, FiSave, FiX } from 'react-icons/fi';
// import { motion } from 'framer-motion';
// import toast from 'react-hot-toast';

// const Profile = () => {
//   const { user, updateUser } = useAuth();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     name: user?.name || '',
//     phoneNumber: user?.phoneNumber || '',
//     company: user?.company || '',
//     gender: user?.gender || ''
//   });

//   const handleSave = async () => {
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       await updateUser(formData);
//       setIsEditing(false);
//       toast.success('Profile updated successfully!');
//     } catch (error) {
//       toast.error('Failed to update profile');
//     }
//   };

//   const handleCancel = () => {
//     setFormData({
//       name: user?.name || '',
//       phoneNumber: user?.phoneNumber || '',
//       company: user?.company || '',
//       gender: user?.gender || ''
//     });
//     setIsEditing(false);
//   };

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <span className="text-gray-600 text-lg">Loading profile...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
//         <p className="text-gray-600">
//           Manage your account information and preferences
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Profile Information */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
//               {!isEditing ? (
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="btn-secondary flex items-center"
//                 >
//                   <FiEdit3 className="mr-2 h-4 w-4" />
//                   Edit
//                 </button>
//               ) : (
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={handleCancel}
//                     className="btn-secondary flex items-center"
//                   >
//                     <FiX className="mr-2 h-4 w-4" />
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSave}
//                     className="btn-primary flex items-center"
//                   >
//                     <FiSave className="mr-2 h-4 w-4" />
//                     Save
//                   </button>
//                 </div>
//               )}
//             </div>

//             <div className="space-y-6">
//               {/* Name */}
//               <div>
//                 <label className="form-label flex items-center">
//                   <FiUser className="mr-2 h-4 w-4" />
//                   Full Name
//                 </label>
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => setFormData({...formData, name: e.target.value})}
//                     className="input-field"
//                     placeholder="Enter your full name"
//                   />
//                 ) : (
//                   <p className="text-gray-900">{user?.name || 'Not provided'}</p>
//                 )}
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="form-label flex items-center">
//                   <FiMail className="mr-2 h-4 w-4" />
//                   Email Address
//                 </label>
//                 <div className="flex items-center space-x-2">
//                   <p className="text-gray-900">{user?.email}</p>
//                   {user?.emailVerified && (
//                     <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-800">
//                       Verified
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Phone Number */}
//               <div>
//                 <label className="form-label flex items-center">
//                   <FiPhone className="mr-2 h-4 w-4" />
//                   Phone Number
//                 </label>
//                 {isEditing ? (
//                   <input
//                     type="tel"
//                     value={formData.phoneNumber}
//                     onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
//                     className="input-field"
//                     placeholder="Enter your phone number"
//                   />
//                 ) : (
//                   <p className="text-gray-900">{user?.phoneNumber || 'Not provided'}</p>
//                 )}
//               </div>

//               {/* Company */}
//               <div>
//                 <label className="form-label flex items-center">
//                   <FiBuilding className="mr-2 h-4 w-4" />
//                   Company
//                 </label>
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     value={formData.company}
//                     onChange={(e) => setFormData({...formData, company: e.target.value})}
//                     className="input-field"
//                     placeholder="Enter your company name"
//                   />
//                 ) : (
//                   <p className="text-gray-900">{user?.company || 'Not provided'}</p>
//                 )}
//               </div>

//               {/* Gender */}
//               <div>
//                 <label className="form-label">Gender</label>
//                 {isEditing ? (
//                   <select
//                     value={formData.gender}
//                     onChange={(e) => setFormData({...formData, gender: e.target.value})}
//                     className="input-field"
//                   >
//                     <option value="">Select gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                     <option value="prefer-not-to-say">Prefer not to say</option>
//                   </select>
//                 ) : (
//                   <p className="text-gray-900 capitalize">{user?.gender || 'Not provided'}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Account Summary */}
//         <div className="space-y-6">
//           {/* Account Status */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Email Verification</span>
//                 <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
//                   user?.emailVerified 
//                     ? 'bg-success-100 text-success-800' 
//                     : 'bg-warning-100 text-warning-800'
//                 }`}>
//                   {user?.emailVerified ? 'Verified' : 'Pending'}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Account Created</span>
//                 <span className="text-sm text-gray-900">
//                   {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Last Login</span>
//                 <span className="text-sm text-gray-900">
//                   {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'N/A'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Quick Actions */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
//             <div className="space-y-3">
//               <button className="w-full btn-secondary text-left">
//                 Change Password
//               </button>
//               <button className="w-full btn-secondary text-left">
//                 Download My Data
//               </button>
//               <button className="w-full btn-secondary text-left">
//                 Privacy Settings
//               </button>
//             </div>
//           </div>

//           {/* Account Stats */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h3>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Total Queries</span>
//                 <span className="text-lg font-semibold text-gray-900">24</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Files Uploaded</span>
//                 <span className="text-lg font-semibold text-gray-900">3</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Charts Generated</span>
//                 <span className="text-lg font-semibold text-gray-900">18</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile; 

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiMail, FiPhone, FiHome, FiEdit3, FiSave, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    company: user?.company || '',
    gender: user?.gender || ''
  });

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      await updateUser(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phoneNumber: user?.phoneNumber || '',
      company: user?.company || '',
      gender: user?.gender || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-600 text-lg">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary flex items-center"
                >
                  <FiEdit3 className="mr-2 h-4 w-4" />
                  Edit
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="btn-secondary flex items-center"
                  >
                    <FiX className="mr-2 h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn-primary flex items-center"
                  >
                    <FiSave className="mr-2 h-4 w-4" />
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="form-label flex items-center">
                  <FiUser className="mr-2 h-4 w-4" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-gray-900">{user?.name || 'Not provided'}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="form-label flex items-center">
                  <FiMail className="mr-2 h-4 w-4" />
                  Email Address
                </label>
                <div className="flex items-center space-x-2">
                  <p className="text-gray-900">{user?.email}</p>
                  {user?.emailVerified && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-800">
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="form-label flex items-center">
                  <FiPhone className="mr-2 h-4 w-4" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p className="text-gray-900">{user?.phoneNumber || 'Not provided'}</p>
                )}
              </div>

              {/* Company */}
              <div>
                <label className="form-label flex items-center">
                  <FiHome className="mr-2 h-4 w-4" />
                  Company
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="input-field"
                    placeholder="Enter your company name"
                  />
                ) : (
                  <p className="text-gray-900">{user?.company || 'Not provided'}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="form-label">Gender</label>
                {isEditing ? (
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{user?.gender || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Summary */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Verification</span>
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                  user?.emailVerified 
                    ? 'bg-success-100 text-success-800' 
                    : 'bg-warning-100 text-warning-800'
                }`}>
                  {user?.emailVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Account Created</span>
                <span className="text-sm text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Login</span>
                <span className="text-sm text-gray-900">
                  {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-secondary text-left">
                Change Password
              </button>
              <button className="w-full btn-secondary text-left">
                Download My Data
              </button>
              <button className="w-full btn-secondary text-left">
                Privacy Settings
              </button>
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Queries</span>
                <span className="text-lg font-semibold text-gray-900">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Files Uploaded</span>
                <span className="text-lg font-semibold text-gray-900">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Charts Generated</span>
                <span className="text-lg font-semibold text-gray-900">18</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;