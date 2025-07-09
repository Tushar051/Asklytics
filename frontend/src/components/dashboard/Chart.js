import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Chart = ({ data, chartType, title }) => {
  const chartRef = useRef(null);

  const getChartData = () => {
    if (!data || !Array.isArray(data)) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Determine the best labels and values based on data structure
    let labels = [];
    let values = [];
    let labelKey = '';
    let valueKey = '';

    // Find the best label and value keys
    if (data.length > 0) {
      const firstItem = data[0];
      const keys = Object.keys(firstItem);
      
      // Find label key (prefer department, name, or first non-numeric key)
      for (let key of keys) {
        if (key === 'department' || key === 'name' || key === 'salary_range' || key === 'metric') {
          labelKey = key;
          break;
        }
      }
      if (!labelKey) {
        for (let key of keys) {
          if (typeof firstItem[key] !== 'number') {
            labelKey = key;
            break;
          }
        }
      }

      // Find value key (prefer salary, employee_count, avg_salary, value, or first numeric key)
      for (let key of keys) {
        if (key === 'salary' || key === 'employee_count' || key === 'avg_salary' || key === 'value' || key === 'percentage') {
          valueKey = key;
          break;
        }
      }
      if (!valueKey) {
        for (let key of keys) {
          if (typeof firstItem[key] === 'number') {
            valueKey = key;
            break;
          }
        }
      }
    }

    // Extract labels and values
    labels = data.map(item => item[labelKey] || 'Unknown');
    values = data.map(item => item[valueKey] || 0);

    const colors = [
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 99, 132, 0.8)',
      'rgba(255, 205, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(199, 199, 199, 0.8)',
      'rgba(83, 102, 255, 0.8)'
    ];

    return {
      labels,
      datasets: [
        {
          label: valueKey ? valueKey.replace('_', ' ').toUpperCase() : 'Value',
          data: values,
          backgroundColor: colors.slice(0, values.length),
          borderColor: colors.slice(0, values.length).map(color => color.replace('0.8', '1')),
          borderWidth: 2,
        }
      ]
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title || 'Analytics Chart',
      },
    },
    scales: chartType === 'bar' ? {
      y: {
        beginAtZero: true,
      },
    } : undefined,
  };

  const renderChart = () => {
    const chartData = getChartData();

    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      case 'line':
        return <Line data={chartData} options={options} />;
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div className="h-64 w-full">
      {renderChart()}
    </div>
  );
};

export default Chart; 