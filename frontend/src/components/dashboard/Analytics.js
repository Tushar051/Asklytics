import React, { useState, useEffect } from 'react';
import { FiPlay } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
// Remove Chart import
// import Chart from './Chart';

const Analytics = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [dataSource, setDataSource] = useState('csv'); // 'csv' or 'database'
  const [showDatabaseForm, setShowDatabaseForm] = useState(false);
  const [systemStatus, setSystemStatus] = useState('unknown'); // 'api_mode', 'fallback_mode', 'unknown'
  const [selectedChartType, setSelectedChartType] = useState('bar'); // 'bar', 'pie', 'line'
  const [databaseConfig, setDatabaseConfig] = useState({
    host: '',
    port: '',
    username: '',
    password: '',
    database: '',
    type: 'mysql'
  });

  // Auto-test Gemini API on component mount
  useEffect(() => {
    const testGeminiOnLoad = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        
        const response = await fetch('http://localhost:8080/api/analytics/test-gemini', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          setSystemStatus(data.status);
        }
      } catch (error) {
        console.error('Auto-test Gemini failed:', error);
      }
    };

    testGeminiOnLoad();
  }, []);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter a question');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Submitting query:', query);
      console.log('Token present:', !!token);
      console.log('DataSource:', dataSource);
      
      const requestBody = {
        query: query,
        dataSource: dataSource,
        tableSchema: 'employees(id INT, name VARCHAR(100), email VARCHAR(100), department VARCHAR(50), salary DECIMAL(10,2), hire_date DATE, location VARCHAR(100))'
      };
      
      console.log('Request body:', requestBody);
      
      const response = await fetch('http://localhost:8080/api/analytics/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setResults(data);
        // setSelectedChartType(data.chartType || 'bar'); // Set the suggested chart type
        toast.success('Analysis completed!');
      } else {
        toast.error(data.error || 'Failed to process query');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to process query');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDatabaseConnect = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8080/api/analytics/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(databaseConfig)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Database connected successfully!');
        setShowDatabaseForm(false);
        setDataSource('database');
      } else {
        toast.error(data.error || 'Failed to connect to database');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to connect to database');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestGemini = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8080/api/analytics/test-gemini', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setSystemStatus(data.status);
        if (data.status === 'fallback_mode') {
          toast.success('System is working in demo mode! Gemini API not configured, but fallback responses are available.');
          console.log('Fallback mode active:', data);
        } else {
          toast.success('Gemini API is working!');
          console.log('Gemini API mode active:', data);
        }
      } else {
        toast.error(data.error || 'Gemini API test failed');
        console.error('Gemini test error:', data);
      }
    } catch (error) {
      console.error('Error testing Gemini:', error);
      toast.error('Failed to test Gemini API');
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQueries = [
    "Give me employees whose salary is above 50000",
    "Show me the average salary by department",
    "Which employees have the highest salaries?",
    "How many employees are in each department?",
    "Show employees hired in the last year",
    "What is the salary distribution across the company?"
  ];

  return (
    <div className="min-h-screen relative font-[Poppins,sans-serif] overflow-x-hidden">
      {/* Animated Blobs Background */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-full filter blur-3xl opacity-60 animate-blob1"
          animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] bg-gradient-to-tr from-pink-100 via-blue-100 to-purple-200 rounded-full filter blur-2xl opacity-50 animate-blob2"
          animate={{ scale: [1, 1.08, 1], x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Header */}
      <div className="max-w-5xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="glass-card p-10 mb-10 flex flex-col md:flex-row md:items-center md:justify-between shadow-2xl"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2 tracking-tight drop-shadow-lg relative inline-block">
              Business Analytics
              <motion.span
                className="block h-1 w-2/3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full absolute left-0 -bottom-2"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                style={{ originX: 0 }}
              />
            </h1>
            <p className="text-lg text-blue-700 font-medium drop-shadow-sm">
              Ask questions in natural language and get instant insights from your data.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <span className="text-xs text-blue-600 font-semibold tracking-widest bg-blue-100 bg-opacity-60 px-4 py-2 rounded-full shadow-md">
              Real Dataset
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Query Interface */}
          <div className="lg:col-span-2 space-y-10">
            {/* Query Input */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="glass-card p-10"
              whileHover={{ scale: 1.015, boxShadow: '0 12px 40px 0 rgba(31,38,135,0.18)' }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ask Your Question</h2>
              <form onSubmit={handleQuerySubmit} className="space-y-4">
                <div>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., Give me employees whose salary is above 50000"
                    className="w-full h-24 px-4 py-3 rounded-2xl border-none bg-blue-50 bg-opacity-70 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none resize-none text-lg shadow-inner transition-all duration-300"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-blue-600">
                    Using company dataset
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.04, background: 'linear-gradient(90deg,#a1c4fd,#c2e9fb)' }}
                    className="bg-gradient-to-r from-blue-400 to-purple-300 hover:from-purple-300 hover:to-blue-400 text-white font-bold py-2 px-8 rounded-2xl shadow-lg flex items-center transition-all duration-200 focus:ring-2 focus:ring-blue-300"
                  >
                    {isLoading ? (
                      <div className="loading-spinner mr-2"></div>
                    ) : (
                      <FiPlay className="mr-2 h-5 w-5" />
                    )}
                    {isLoading ? 'Analyzing...' : 'Analyze'}
                  </motion.button>
                </div>
              </form>
            </motion.div>

            {/* Sample Queries */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              className="glass-card p-10"
              whileHover={{ scale: 1.01, boxShadow: '0 12px 40px 0 rgba(31,38,135,0.13)' }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Sample Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sampleQueries.map((sampleQuery, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setQuery(sampleQuery)}
                    whileHover={{ scale: 1.05, backgroundColor: '#e0e7ff' }}
                    whileTap={{ scale: 0.98 }}
                    className="text-left p-3 rounded-2xl bg-blue-50 bg-opacity-70 text-blue-700 hover:bg-blue-200 transition-colors shadow-md"
                  >
                    <p className="text-base font-medium">{sampleQuery}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Results Panel */}
          <div className="space-y-10">
            <AnimatePresence>
              {results && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="glass-card p-10"
                  whileHover={{ scale: 1.01, boxShadow: '0 12px 40px 0 rgba(31,38,135,0.13)' }}
                >
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Results</h2>
                  {/* Summary */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-blue-700 mb-2">Summary</h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-base text-blue-800 bg-blue-50 bg-opacity-70 p-3 rounded-2xl"
                    >
                      {results.summary}
                    </motion.p>
                  </div>
                  {/* SQL Query */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-blue-700 mb-2">Generated SQL</h3>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="bg-gray-100 text-green-700 p-3 rounded-2xl text-sm font-mono overflow-x-auto shadow-inner"
                    >
                      {results.sql}
                    </motion.div>
                  </div>
                  {/* Data Table */}
                  <div>
                    <h3 className="text-sm font-medium text-blue-700 mb-2">Data</h3>
                    <div className="overflow-x-auto rounded-2xl shadow-inner">
                      <table className="min-w-full divide-y divide-blue-200">
                        <thead className="bg-blue-50 bg-opacity-70">
                          <tr>
                            {results.data.length > 0 && Object.keys(results.data[0]).map((key) => (
                              <th key={key} className="px-3 py-2 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                                {key.replace('_', ' ')}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white bg-opacity-70 divide-y divide-blue-100">
                          {results.data.map((row, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              whileHover={{ scale: 1.01, backgroundColor: '#e0e7ff' }}
                            >
                              {Object.values(row).map((value, valueIndex) => (
                                <td key={valueIndex} className="px-3 py-2 text-base text-gray-800">
                                  {typeof value === 'number' ? value.toLocaleString() : value}
                                </td>
                              ))}
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="w-full py-6 text-center text-blue-700 text-sm font-semibold tracking-widest bg-blue-100 bg-opacity-80 mt-12 shadow-2xl rounded-t-2xl backdrop-blur-md">
        Developed by Tushar Kedar
      </footer>
      {/* Glassmorphism styles and animated blob keyframes */}
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 2rem;
          box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.13);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          transition: box-shadow 0.3s, transform 0.3s;
        }
        body, html {
          font-family: 'Poppins', 'Inter', 'Segoe UI', 'Roboto', 'Arial', sans-serif;
        }
        @keyframes blob1 {
          0%, 100% { transform: scale(1) translate(0,0); }
          50% { transform: scale(1.1) translate(40px,-30px); }
        }
        @keyframes blob2 {
          0%, 100% { transform: scale(1) translate(0,0); }
          50% { transform: scale(1.08) translate(-30px,40px); }
        }
        .animate-blob1 { animation: blob1 12s infinite ease-in-out; }
        .animate-blob2 { animation: blob2 14s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default Analytics; 