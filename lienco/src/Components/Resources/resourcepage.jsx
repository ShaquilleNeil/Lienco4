// src/components/MaterialLevelsPage.jsx
import React, { useState } from 'react';
import GaugeChart from 'react-gauge-chart';
import { Typography, Grid, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Header from '../Dashboard/Header.jsx';
import Sidebar from '../Dashboard/SideBar.jsx';
import BudgetTracker from './budgettracker.jsx';
import './resource.css';

const ResourcePage = ({ resourceData, userRole, onLogout }) => { // Accept userRole as a prop
  const [totalBudget, setTotalBudget] = useState(10000); // Manage total budget state
  const [usedBudget, setUsedBudget] = useState(4500);

  const [data, setData] = useState(resourceData || [
    { name: 'Cement', level: 50, max: 100 },
    { name: 'Steel', level: 50, max: 100 },
    { name: 'Wood', level: 55, max: 100 },
    { name: 'Bricks', level: 60, max: 100 },
  ]);

  const getSegmentColor = (level) => {
    if (level > 70) return '#00FF00';
    if (level > 40) return '#FFFF00';
    return '#FF0000';
  };

  const handleBudgetChange = (newTotalBudget, newUsedBudget) => {
    setTotalBudget(newTotalBudget);
    setUsedBudget(newUsedBudget);
  };

  // Modal state management
  const [open, setOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [newLevel, setNewLevel] = useState('');
  const [newMax, setNewMax] = useState('');

  const handleOpen = (resource) => {
    setSelectedResource(resource);
    setNewLevel(resource.level); // Pre-fill with current level
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = () => {
    if (selectedResource) {
      const updatedData = data.map(resource => 
        resource.name === selectedResource.name ? { ...resource, level: newLevel, max: newMax } : resource
    
      );
      setData(updatedData);
    }
    handleClose();
  };

  return (
    <div className="resource-dashboard">
      <Header onLogout={onLogout} userRole={userRole}/>
      <Sidebar className="sidebar" />
      <div className="resource-content">
        <div className="main-content">
          <BudgetTracker totalBudget={totalBudget} usedBudget={usedBudget} onBudgetChange={handleBudgetChange} />
          <Typography variant="h4" gutterBottom align="center">
            Construction Material Levels
          </Typography>
          <Grid container spacing={1} style={{ padding: '0 4px' }}>
            {data.map((resource) => {
              const gaugeValue = resource.level / resource.max;
              const segmentColor = getSegmentColor(resource.level);

              const arcsLength = [
                resource.level > 70 ? 1 : resource.level > 40 ? resource.level / resource.max : 0,
                resource.level > 40 ? (resource.level / resource.max) - (resource.level > 70 ? 1 : 0) : resource.level / resource.max,
                1 - resource.level / resource.max,
              ];

              return (
                <Grid item xs={12} sm={6} md={4} key={resource.name}>
                  <Paper
                    style={{
                      padding: '1px',
                      textAlign: 'center',
                      marginBottom: '10px',
                      backgroundColor: 'transparent',
                      border: '1px solid white',
                      color: 'white',
                      borderRadius: '10px',
                      width: '500px',
                      height: '300px',
                    }}
                  >
                    <GaugeChart
                      id={`gauge-${resource.name}`}
                      nrOfLevels={3}
                      arcsLength={arcsLength}
                      colors={['#FF0000', '#FFFF00', '#00FF00']}
                      percent={gaugeValue}
                      style={{ width: '520px', height: '200px' }}
                    />
                    <Typography variant="h6" style={{ marginTop: '10px', color: segmentColor }}>
                      {`${(gaugeValue * 100).toFixed(0)}%`}
                    </Typography>
                    <Typography variant="h6" style={{ marginTop: '10px' }}>
                      {resource.name}
                    </Typography>
                    {/* Conditional rendering of the button based on user role */}
                    {userRole === 'project manager' && (
                      <Button variant="contained" color="secondary" onClick={() => handleOpen(resource)}>
                        Update Level
                      </Button>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </div>

      {/* Modal for updating material levels */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Material Level</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Level"
            type="number"
            fullWidth
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value)}
          />
           <TextField
            autoFocus
            margin="dense"
            label="New Max"
            type="number"
            fullWidth
            value={newMax}
            onChange={(e) => setNewMax(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResourcePage;
