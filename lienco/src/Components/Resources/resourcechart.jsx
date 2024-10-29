// src/components/ResourceChart.jsx

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Typography, Container, Grid, Paper } from '@mui/material';

const ResourceChart = ({ resourceData }) => {
  // Sample data for demonstration
  const data = resourceData || [
    { name: 'Cement', level: 50, max: 100 },
    { name: 'Steel', level: 30, max: 100 },
    { name: 'Wood', level: 75, max: 100 },
    { name: 'Bricks', level: 60, max: 100 },
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Construction Material Levels
      </Typography>
      <Grid container spacing={3}>
        {data.map((resource) => {
          // Bar chart data and configuration for each resource
          const chartData = {
            labels: [resource.name],
            datasets: [
              {
                label: 'Current Level',
                data: [resource.level],
                backgroundColor: resource.level > 70 ? 'green' : resource.level > 40 ? 'yellow' : 'red',
              },
              {
                label: 'Max Level',
                data: [resource.max],
                backgroundColor: 'gray',
              },
            ],
          };

          const options = {
            scales: {
              y: {
                beginAtZero: true,
                max: resource.max,
              },
            },
            plugins: {
              legend: {
                position: 'top',
              },
            },
          };

          return (
            <Grid item xs={12} sm={6} md={4} key={resource.name}>
              <Paper style={{ padding: '20px' }}>
                <Bar data={chartData} options={options} />
                <Typography variant="h6" align="center" style={{ marginTop: '10px' }}>
                  {resource.name}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

  
  export default ResourceChart;
