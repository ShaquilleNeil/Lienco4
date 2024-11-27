import React, { useEffect, useState } from 'react';
import { LinearProgress, Typography, Box, Paper, Button, Modal, TextField } from '@mui/material';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase'; // Adjust the import based on your project structure

const BudgetTracker = () => {
  const [totalBudget, setTotalBudget] = useState(0);
  const [usedBudget, setUsedBudget] = useState(0);
  const [newTotalBudget, setNewTotalBudget] = useState(0);
  const [newUsedBudget, setNewUsedBudget] = useState(0); // Add newUsedBudget state
  const [open, setOpen] = useState(false);
  const [userRole, setUserRole] = useState(''); // State for user role

  useEffect(() => {
    const fetchUserRoleAndBudget = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const uid = user.uid;
        const rolesDocRef = doc(db, 'Roles', uid);
        const rolesDocSnap = await getDoc(rolesDocRef);

        if (rolesDocSnap.exists()) {
          const roleData = rolesDocSnap.data();
          setUserRole(roleData.Role);
          console.log("User role fetched:", roleData.Role);
        } else {
          console.log('No role document found for the user');
        }
      }

      // Fetch the budget
      const docRef = doc(db, 'budget', 'my_budget'); // Use consistent document ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTotalBudget(data.totalBudget || 0);
        setUsedBudget(data.usedBudget || 0);
        setNewTotalBudget(data.totalBudget || 0);
      } else {
        // If the document doesn't exist, initialize it
        await setDoc(docRef, {
          totalBudget: 10000,
          usedBudget: 0,
        });
        setTotalBudget(10000);
        setUsedBudget(0);
        setNewTotalBudget(10000);
      }
    };

    fetchUserRoleAndBudget();
  }, []);

  const percentUsed = (totalBudget > 0) ? (usedBudget / totalBudget) * 100 : 0;
  const availableBudget = totalBudget - usedBudget;

  const handleOpen = () => {
    setNewTotalBudget(totalBudget);
    setNewUsedBudget(0); // Reset new used budget when opening modal
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    const docRef = doc(db, 'budget', 'my_budget');

    if (userRole === 'user') {
      // User can adjust total budget
      await setDoc(docRef, {
        totalBudget: newTotalBudget,
        usedBudget: usedBudget, // Keep existing usedBudget
      });
      setTotalBudget(newTotalBudget);
    } else if (userRole === 'project manager') {
      // Project Manager can adjust used budget
      await setDoc(docRef, {
        totalBudget: totalBudget, // Keep existing totalBudget
        usedBudget: newUsedBudget, // Update only usedBudget
      });
      setUsedBudget(newUsedBudget);
    }

    handleClose();
  };

  return (
    <Paper style={{ padding: '20px', textAlign: 'center', marginBottom: '20px', backgroundColor: 'transparent', color: 'white', border: 'none', borderRadius: '10px', width: '90%',  margin: '0 auto', overflow: 'auto' }}>
      <Typography variant="h6" style={{ marginBottom: '10px' }}>
        Budget Tracker
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
        <Typography variant="body1">{`Used: $${usedBudget.toFixed(2)} / Total: $${totalBudget.toFixed(2)}`}</Typography>
        <Typography variant="body1">{`Available: $${availableBudget.toFixed(2)}`}</Typography>
        <LinearProgress variant="determinate" value={percentUsed} style={{ width: '100%', marginTop: '10px' }} />
        <Typography variant="body2" style={{ marginTop: '10px', color: percentUsed > 80 ? '#FF0000' : '#00FF00' }}>
          {`${percentUsed.toFixed(0)}% Used`}
        </Typography>
        
        {(userRole === 'user' || userRole === 'project manager') && ( // Show button for users
          <Button variant="contained" color="secondary" style={{ marginTop: '10px' }} onClick={handleOpen}>
            Adjust Budget
          </Button>
        )}
      </Box>

      {/* Modal for adjusting budget */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '10px',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Adjust Budget
          </Typography>
          {userRole === 'user' && (
            <TextField
              label="Total Budget"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newTotalBudget}
              onChange={(e) => setNewTotalBudget(parseFloat(e.target.value) || 0)}
              type="number"
            />
          )}
          {userRole === 'project manager' && (
            <TextField
              label="Used Budget"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newUsedBudget}
              onChange={(e) => setNewUsedBudget(parseFloat(e.target.value) || 0)}
              type="number"
            />
          )}
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button onClick={handleClose} color="primary" style={{ marginRight: '10px' }}>
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" color="secondary">
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
};

export default BudgetTracker;
