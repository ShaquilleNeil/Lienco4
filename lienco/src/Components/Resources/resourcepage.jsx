// src/components/MaterialLevelsPage.jsx
import React from 'react';
import GaugeChart from 'react-gauge-chart';
import { Typography, Container, Grid, Paper } from '@mui/material';
import Header from '../Dashboard/Header.jsx';
import Sidebar from '../Dashboard/SideBar.jsx';
import './resource.css';

const ResourcePage = ({ resourceData }) => {
  const data = resourceData || [
    { name: 'Cement', level: 50, max: 100 },
    { name: 'Steel', level: 50, max: 100 },
    { name: 'Wood', level: 55, max: 100 },
    { name: 'Bricks', level: 60, max: 100 },
    { name: 'Bricks', level: 60, max: 100 },
    { name: 'Bricks', level: 60, max: 100 },
  ];

  const getSegmentColor = (level) => {
    if (level > 70) return '#00FF00'; // Green for levels > 70
    if (level > 40) return '#FFFF00'; // Yellow for levels > 40
    return '#FF0000'; // Red for levels <= 40
  };

  return (
    <div className="resource-dashboard">
      <Header />
      <Sidebar />
      <Container style={{ padding: '200px 0', backgroundColor: 'black' }}>
        <Typography variant="h4" gutterBottom>
          Construction Material Levels
        </Typography>
        <Grid container spacing={4}>
          {data.map((resource) => {
            const gaugeValue = resource.level / resource.max; // Normalize level to a value between 0 and 1
            const segmentColor = getSegmentColor(resource.level); // Determine the color for the percentage text

            // Calculate arcs for three segments
            const arcsLength = [
              resource.level > 70 ? 1 : (resource.level > 40 ? (resource.level / resource.max) : 0), // Green
              resource.level > 40 ? (resource.level / resource.max) - (resource.level > 70 ? 1 : 0) : (resource.level / resource.max), // Yellow
              1 - (resource.level / resource.max) // Red
            ];

            return (
              <Grid item xs={12} sm={6} md={4} key={resource.name}>
                <Paper style={{ padding: '20px', textAlign: 'center', marginBottom: '20px', backgroundColor: 'white' }}>
                  <GaugeChart
                    id={`gauge-${resource.name}`}
                    nrOfLevels={3} // Three segments
                    arcsLength={arcsLength} // Create segments based on the current level
                    colors={[ '#FF0000','#FFFF00','#00FF00']} // Colors for the segments
                    percent={gaugeValue} // Set the percent value for the gauge
                    style={{ width: '100%', height: '200px' }} // Adjust gauge size
                  />
                  <Typography variant="h6" style={{ marginTop: '10px', color: segmentColor }}>
                    {`${(gaugeValue * 100).toFixed(0)}%`} {/* Display percentage */}
                  </Typography>
                  <Typography variant="h6" style={{ marginTop: '10px' }}>
                    {resource.name}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
};

export default ResourcePage;
