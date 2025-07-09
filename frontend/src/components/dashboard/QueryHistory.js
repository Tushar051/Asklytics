// import React, { useState } from 'react';
// import { FiEye, FiBarChart3, FiPieChart, FiTrendingUp, FiCalendar, FiClock } from 'react-icons/fi';
// import { motion } from 'framer-motion';

// const QueryHistory = () => {
//   const [selectedQuery, setSelectedQuery] = useState(null);
//   const [chartType, setChartType] = useState('bar');

//   // Mock query history data
//   const queryHistory = [
//     {
//       id: 1,
//       query: "Show average salary of engineers in Bangalore",
//       sql: "SELECT AVG(salary) as avg_salary, department FROM employees WHERE location = 'Bangalore' AND role = 'Engineer' GROUP BY department",
//       summary: "The average salary of engineers in Bangalore is $85,000. The highest paying department is Software Engineering with an average of $95,000.",
//       data: [
//         { department: 'Software Engineering', avg_salary: 95000 },
//         { department: 'Data Science', avg_salary: 90000 },
//         { department: 'DevOps', avg_salary: 85000 },
//         { department: 'QA', avg_salary: 75000 }
//       ],
//       timestamp: '2024-01-15T10:30:00Z',
//       status: 'completed'
//     },
//     {
//       id: 2,
//       query: "What is the employee distribution by department?",
//       sql: "SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department ORDER BY employee_count DESC",
//       summary: "Engineering has the most employees (45%), followed by Sales (25%), Marketing (15%), and HR (15%).",
//       data: [
//         { department: 'Engineering', employee_count: 450 },
//         { department: 'Sales', employee_count: 250 },
//         { department: 'Marketing', employee_count: 150 },
//         { department: 'HR', employee_count: 150 }
//       ],
//       timestamp: '2024-01-14T15:45:00Z',
//       status: 'completed'
//     },
//     {
//       id: 3,
//       query: "Show salary trends over the last 5 years",
//       sql: "SELECT YEAR(hire_date) as year, AVG(salary) as avg_salary FROM employees WHERE hire_date >= DATE_SUB(NOW(), INTERVAL 5 YEAR) GROUP BY YEAR(hire_date) ORDER BY year",
//       summary: "Average salaries have increased by 15% over the last 5 years, from $70,000 in 2019 to $80,500 in 2024.",
//       data: [
//         { year: 2019, avg_salary: 70000 },
//         { year: 2020, avg_salary: 72000 },
//         { year: 2021, avg_salary: 75000 },
//         { year: 2022, avg_salary: 78000 },
//         { year: 2023, avg_salary: 80000 },
//         { year: 2024, avg_salary: 80500 }
//       ],
//       timestamp: '2024-01-13T09:15:00Z',
//       status: 'completed'
//     }
//   ];

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const handleVisualize = (query) => {
//     setSelectedQuery(query);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <h1 className="text-2xl font-bold text-gray-900 mb-2">Query History</h1>
//         <p className="text-gray-600">
//           View and re-visualize your past analytics queries
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Query List */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Queries</h2>
//             <div className="space-y-4">
//               {queryHistory.map((query) => (
//                 <motion.div
//                   key={query.id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className={`p-4 rounded-lg border cursor-pointer transition-colors ${
//                     selectedQuery?.id === query.id
//                       ? 'border-primary-500 bg-primary-50'
//                       : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
//                   }`}
//                   onClick={() => setSelectedQuery(query)}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-900 mb-1">
//                         {query.query}
//                       </p>
//                       <div className="flex items-center text-xs text-gray-500">
//                         <FiCalendar className="mr-1" />
//                         {formatDate(query.timestamp)}
//                       </div>
//                     </div>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleVisualize(query);
//                       }}
//                       className="ml-2 p-1 text-gray-400 hover:text-primary-600"
//                     >
//                       <FiBarChart3 className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Query Details and Visualization */}
//         <div className="lg:col-span-2">
//           {selectedQuery ? (
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="bg-white rounded-lg shadow-sm p-6"
//             >
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-lg font-semibold text-gray-900">Query Details</h2>
//                 <div className="flex items-center space-x-2">
//                   <span className="text-xs text-gray-500">Chart Type:</span>
//                   <select
//                     value={chartType}
//                     onChange={(e) => setChartType(e.target.value)}
//                     className="text-sm border border-gray-300 rounded px-2 py-1"
//                   >
//                     <option value="bar">Bar Chart</option>
//                     <option value="pie">Pie Chart</option>
//                     <option value="line">Line Chart</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Query */}
//               <div className="mb-6">
//                 <h3 className="text-sm font-medium text-gray-700 mb-2">Question</h3>
//                 <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
//                   {selectedQuery.query}
//                 </p>
//               </div>

//               {/* Summary */}
//               <div className="mb-6">
//                 <h3 className="text-sm font-medium text-gray-700 mb-2">Summary</h3>
//                 <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
//                   {selectedQuery.summary}
//                 </p>
//               </div>

//               {/* SQL Query */}
//               <div className="mb-6">
//                 <h3 className="text-sm font-medium text-gray-700 mb-2">Generated SQL</h3>
//                 <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-sm font-mono overflow-x-auto">
//                   {selectedQuery.sql}
//                 </div>
//               </div>

//               {/* Chart */}
//               <div className="mb-6">
//                 <h3 className="text-sm font-medium text-gray-700 mb-2">Visualization</h3>
//                 <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
//                   <div className="text-center">
//                     {chartType === 'bar' && <FiBarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />}
//                     {chartType === 'pie' && <FiPieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />}
//                     {chartType === 'line' && <FiTrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />}
//                     <p className="text-sm text-gray-500">{chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Data Table */}
//               <div>
//                 <h3 className="text-sm font-medium text-gray-700 mb-2">Data</h3>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         {Array.isArray(selectedQuery.data) && selectedQuery.data.length > 0 && Object.keys(selectedQuery.data[0]).map((key) => (
//                           <th key={key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             {key.replace(/_/g, ' ')}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {Array.isArray(selectedQuery.data) && selectedQuery.data.map((row, index) => (
//                         <tr key={index}>
//                           {Object.values(row).map((value, valueIndex) => (
//                             <td key={valueIndex} className="px-3 py-2 text-sm text-gray-900">
//                               {typeof value === 'number' ? value.toLocaleString() : value}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </motion.div>
//           ) : (
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <div className="text-center py-12">
//                 <FiEye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Query</h3>
//                 <p className="text-gray-500">
//                   Choose a query from the list to view its details and visualizations
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QueryHistory; 


import React, { useState } from 'react';
import { FiEye, FiBarChart2, FiPieChart, FiTrendingUp, FiCalendar, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const QueryHistory = () => {
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [chartType, setChartType] = useState('bar');

  // Mock query history data
  const queryHistory = [
    {
      id: 1,
      query: "Show average salary of engineers in Bangalore",
      sql: "SELECT AVG(salary) as avg_salary, department FROM employees WHERE location = 'Bangalore' AND role = 'Engineer' GROUP BY department",
      summary: "The average salary of engineers in Bangalore is $85,000. The highest paying department is Software Engineering with an average of $95,000.",
      data: [
        { department: 'Software Engineering', avg_salary: 95000 },
        { department: 'Data Science', avg_salary: 90000 },
        { department: 'DevOps', avg_salary: 85000 },
        { department: 'QA', avg_salary: 75000 }
      ],
      timestamp: '2024-01-15T10:30:00Z',
      status: 'completed'
    },
    {
      id: 2,
      query: "What is the employee distribution by department?",
      sql: "SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department ORDER BY employee_count DESC",
      summary: "Engineering has the most employees (45%), followed by Sales (25%), Marketing (15%), and HR (15%).",
      data: [
        { department: 'Engineering', employee_count: 450 },
        { department: 'Sales', employee_count: 250 },
        { department: 'Marketing', employee_count: 150 },
        { department: 'HR', employee_count: 150 }
      ],
      timestamp: '2024-01-14T15:45:00Z',
      status: 'completed'
    },
    {
      id: 3,
      query: "Show salary trends over the last 5 years",
      sql: "SELECT YEAR(hire_date) as year, AVG(salary) as avg_salary FROM employees WHERE hire_date >= DATE_SUB(NOW(), INTERVAL 5 YEAR) GROUP BY YEAR(hire_date) ORDER BY year",
      summary: "Average salaries have increased by 15% over the last 5 years, from $70,000 in 2019 to $80,500 in 2024.",
      data: [
        { year: 2019, avg_salary: 70000 },
        { year: 2020, avg_salary: 72000 },
        { year: 2021, avg_salary: 75000 },
        { year: 2022, avg_salary: 78000 },
        { year: 2023, avg_salary: 80000 },
        { year: 2024, avg_salary: 80500 }
      ],
      timestamp: '2024-01-13T09:15:00Z',
      status: 'completed'
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleVisualize = (query) => {
    setSelectedQuery(query);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Query History</h1>
        <p className="text-gray-600">
          View and re-visualize your past analytics queries
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Queries</h2>
            <div className="space-y-4">
              {queryHistory.map((query) => (
                <motion.div
                  key={query.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedQuery?.id === query.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedQuery(query)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {query.query}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <FiCalendar className="mr-1" />
                        {formatDate(query.timestamp)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVisualize(query);
                      }}
                      className="ml-2 p-1 text-gray-400 hover:text-primary-600"
                    >
                      <FiBarChart2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Query Details and Visualization */}
        <div className="lg:col-span-2">
          {selectedQuery ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Query Details</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Chart Type:</span>
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="bar">Bar Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="line">Line Chart</option>
                  </select>
                </div>
              </div>

              {/* Query */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Question</h3>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedQuery.query}
                </p>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Summary</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedQuery.summary}
                </p>
              </div>

              {/* SQL Query */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Generated SQL</h3>
                <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-sm font-mono overflow-x-auto">
                  {selectedQuery.sql}
                </div>
              </div>

              {/* Chart */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Visualization</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    {chartType === 'bar' && <FiBarChart2 className="h-12 w-12 text-gray-400 mx-auto mb-2" />}
                    {chartType === 'pie' && <FiPieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />}
                    {chartType === 'line' && <FiTrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />}
                    <p className="text-sm text-gray-500">{chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart</p>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Data</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {Array.isArray(selectedQuery.data) && selectedQuery.data.length > 0 && Object.keys(selectedQuery.data[0]).map((key) => (
                          <th key={key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {key.replace(/_/g, ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.isArray(selectedQuery.data) && selectedQuery.data.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, valueIndex) => (
                            <td key={valueIndex} className="px-3 py-2 text-sm text-gray-900">
                              {typeof value === 'number' ? value.toLocaleString() : value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center py-12">
                <FiEye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Query</h3>
                <p className="text-gray-500">
                  Choose a query from the list to view its details and visualizations
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryHistory;