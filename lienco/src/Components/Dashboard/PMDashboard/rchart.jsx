import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Paper, Typography } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResourceChart = ({ resourceData }) => {
  // Sample data for the resources
  const data = resourceData || [
    { name: 'Cement', level: 50, max: 100 },
    { name: 'Steel', level: 30, max: 100 },
    { name: 'Wood', level: 75, max: 100 },
    { name: 'Bricks', level: 60, max: 100 },
  ];

  // Prepare chart data
  const labels = data.map((resource) => resource.name); // ['Cement', 'Steel', 'Wood', 'Bricks']
  const levels = data.map((resource) => resource.level); // [50, 30, 75, 60]
  const maxLevels = data.map((resource) => resource.max); // [100, 100, 100, 100]

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Resource Levels',
        data: levels,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Max Level',
        data: maxLevels,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    backgroundColor: 'transparent',
  };

  return (
    <Paper style={{ backgroundColor: 'transparent',padding: '20px', height: '150px' }}>
      <Typography variant="h4" gutterBottom>
        Resource Levels
      </Typography>
      <Bar data={chartData} options={options} />
    </Paper>
  );
};

export default ResourceChart;
