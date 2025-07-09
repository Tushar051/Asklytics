import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiDownload, FiFile, FiCheck, FiX, FiDatabase, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const DataUpload = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [demoData, setDemoData] = useState(null);
  const [userDatasets, setUserDatasets] = useState([]);
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      toast.success('File uploaded successfully!');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  });

  const loadUserDatasets = async () => {
    setIsLoadingDatasets(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        console.log('No token found, skipping dataset load');
        return;
      }
      
      const response = await fetch('http://localhost:8080/api/analytics/datasets', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        console.log('Authentication failed for datasets');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setUserDatasets(data.datasets);
      } else {
        console.error('Failed to load datasets:', data.error);
      }
    } catch (error) {
      console.error('Error loading datasets:', error);
    } finally {
      setIsLoadingDatasets(false);
    }
  };

  const handleProcessFile = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Please log in to upload files');
        return;
      }
      
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch('http://localhost:8080/api/analytics/upload-csv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.status === 401) {
        toast.error('Authentication failed. Please log in again.');
        return;
      }

      if (response.status === 403) {
        toast.error('Access forbidden. Please check your permissions.');
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('File processed and stored successfully! You can now use the Analytics section.');
        setUploadedFile(null);
        // Reload datasets
        await loadUserDatasets();
      } else {
        toast.error(data.error || 'Failed to process file');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteDataset = async (datasetId) => {
    if (!window.confirm('Are you sure you want to delete this dataset?')) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/analytics/datasets/${datasetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Dataset deleted successfully!');
        await loadUserDatasets();
      } else {
        toast.error(data.error || 'Failed to delete dataset');
      }
    } catch (error) {
      console.error('Error deleting dataset:', error);
      toast.error('Failed to delete dataset');
    }
  };

  // Load datasets when component mounts
  useEffect(() => {
    loadUserDatasets();
  }, []);

  // Debug function to check authentication status
  const checkAuthStatus = () => {
    const token = localStorage.getItem('accessToken');
    console.log('Token exists:', !!token);
    if (token) {
      console.log('Token length:', token.length);
      console.log('Token preview:', token.substring(0, 50) + '...');
    }
  };

  // Test authentication with backend
  const testAuthentication = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('No token found');
        return;
      }

      const response = await fetch('http://localhost:8080/api/analytics/test-auth', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('Auth test result:', data);
      
      if (data.success) {
        toast.success('Authentication successful!');
      } else {
        toast.error('Authentication failed: ' + data.message);
      }
    } catch (error) {
      console.error('Auth test error:', error);
      toast.error('Authentication test failed');
    }
  };

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleLoadDemoData = async () => {
    setIsProcessing(true);
    try {
      // Simulate loading demo data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockDemoData = {
        name: 'Employee Dataset',
        description: 'Sample employee data with salary, department, and location information',
        rows: 1000,
        columns: ['id', 'name', 'email', 'department', 'role', 'salary', 'location', 'hire_date'],
        sampleData: [
          { id: 1, name: 'John Doe', email: 'john@company.com', department: 'Engineering', role: 'Software Engineer', salary: 85000, location: 'New York', hire_date: '2022-01-15' },
          { id: 2, name: 'Jane Smith', email: 'jane@company.com', department: 'Marketing', role: 'Marketing Manager', salary: 75000, location: 'San Francisco', hire_date: '2021-08-20' },
          { id: 3, name: 'Bob Johnson', email: 'bob@company.com', department: 'Sales', role: 'Sales Representative', salary: 65000, location: 'Chicago', hire_date: '2022-03-10' }
        ]
      };
      
      setDemoData(mockDemoData);
      toast.success('Demo data loaded successfully!');
    } catch (error) {
      toast.error('Failed to load demo data');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = `id,name,email,department,role,salary,location,hire_date
1,John Doe,john@company.com,Engineering,Software Engineer,85000,New York,2022-01-15
2,Jane Smith,jane@company.com,Marketing,Marketing Manager,75000,San Francisco,2021-08-20
3,Bob Johnson,bob@company.com,Sales,Sales Representative,65000,Chicago,2022-03-10
4,Alice Brown,alice@company.com,Engineering,Data Scientist,90000,Seattle,2021-12-05
5,Charlie Wilson,charlie@company.com,HR,HR Manager,70000,Boston,2022-02-28`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_employee_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Sample CSV downloaded!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Data Upload</h1>
        <p className="text-gray-600">
          Upload your CSV files or use our demo dataset to get started with analytics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CSV Upload Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload CSV File</h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {isDragActive ? (
                <p className="text-primary-600">Drop the file here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    Drag and drop a CSV file here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports .csv, .xls, .xlsx files
                  </p>
                </div>
              )}
            </div>

            {uploadedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-success-50 border border-success-200 rounded-lg"
              >
                <div className="flex items-center">
                  <FiCheck className="h-5 w-5 text-success-600 mr-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-success-800">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-success-600">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-success-600 hover:text-success-800"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {uploadedFile && (
              <button
                onClick={handleProcessFile}
                disabled={isProcessing}
                className="mt-4 btn-primary w-full flex items-center justify-center"
              >
                {isProcessing ? (
                  <div className="loading-spinner mr-2"></div>
                ) : (
                  <FiDatabase className="mr-2 h-4 w-4" />
                )}
                {isProcessing ? 'Processing...' : 'Process File'}
              </button>
            )}
          </div>

          {/* Sample CSV Download */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Started</h3>
            <div className="space-y-4">
              <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                <h4 className="font-medium text-primary-900 mb-2">Download Sample CSV</h4>
                <p className="text-sm text-primary-700 mb-3">
                  Not sure about the format? Download our sample employee dataset to see the expected structure.
                </p>
                <button
                  onClick={downloadSampleCSV}
                  className="btn-primary flex items-center"
                >
                  <FiDownload className="mr-2 h-4 w-4" />
                  Download Sample
                </button>
              </div>
            </div>
          </div>

          {/* User Datasets */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Datasets</h3>
            
            {/* Debug Section */}
            <div className="mb-4 p-3 bg-gray-100 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Debug Info</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Token exists: {localStorage.getItem('accessToken') ? 'Yes' : 'No'}</div>
                <div>Token length: {localStorage.getItem('accessToken')?.length || 0}</div>
                <button 
                  onClick={checkAuthStatus}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Check Auth Status
                </button>
                <button 
                  onClick={testAuthentication}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Test Authentication
                </button>
              </div>
            </div>
            
            {isLoadingDatasets ? (
              <div className="flex items-center justify-center py-8">
                <div className="loading-spinner"></div>
                <span className="ml-2 text-gray-600">Loading datasets...</span>
              </div>
            ) : userDatasets.length > 0 ? (
              <div className="space-y-4">
                {userDatasets.map((dataset) => (
                  <motion.div
                    key={dataset.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{dataset.name}</h4>
                        <p className="text-sm text-gray-600">{dataset.description}</p>
                        <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                          <span>{dataset.rowCount} rows</span>
                          <span>{dataset.columnCount} columns</span>
                          <span>Uploaded {new Date(dataset.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteDataset(dataset.id)}
                        className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete dataset"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FiFile className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>No datasets uploaded yet</p>
                <p className="text-sm">Upload a CSV file to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Demo Data Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Demo Dataset</h2>
            <p className="text-gray-600 mb-4">
              Try out the analytics features with our pre-loaded demo dataset
            </p>
            
            <button
              onClick={handleLoadDemoData}
              disabled={isProcessing || demoData}
              className="btn-secondary w-full flex items-center justify-center"
            >
              {isProcessing ? (
                <div className="loading-spinner mr-2"></div>
              ) : (
                <FiFile className="mr-2 h-4 w-4" />
              )}
              {isProcessing ? 'Loading...' : 'Load Demo Data'}
            </button>
          </div>

          {/* Demo Data Info */}
          {demoData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Dataset Loaded</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{demoData.name}</h4>
                  <p className="text-sm text-gray-600">{demoData.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Rows</p>
                    <p className="text-lg font-semibold text-gray-900">{demoData.rows.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Columns</p>
                    <p className="text-lg font-semibold text-gray-900">{demoData.columns.length}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Columns</h4>
                  <div className="flex flex-wrap gap-2">
                    {demoData.columns.map((column, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-md"
                      >
                        {column}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Sample Data</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {demoData.columns.map((column) => (
                            <th key={column} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {demoData.sampleData.map((row, index) => (
                          <tr key={index}>
                            {demoData.columns.map((column) => (
                              <td key={column} className="px-3 py-2 text-sm text-gray-900">
                                {row[column]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataUpload; 