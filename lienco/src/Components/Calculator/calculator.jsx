import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import your Firebase instance
import { collection, getDocs } from 'firebase/firestore';
import './calc.css';

const AssessmentCalculator = ({ isCalculatorVisible, onClose }) => {
  const [materials, setMaterials] = useState([]); // Default to an empty array
  const [squareFootage, setSquareFootage] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [amount, setAmount] = useState(1); // Amount of resources
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState('');

  const fetchMaterials = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'materials'));
      const materialsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMaterials(materialsData); // Ensure materials are set properly
    } catch (error) {
      console.error('Error fetching materials:', error);
      setError('Failed to load materials');
    }
  };

  useEffect(() => {
    fetchMaterials(); // Fetch materials on component mount
  }, []);

  const handleCalculate = () => {
    if (selectedMaterial && squareFootage > 0 && amount > 0) {
      const costPerSqFt = selectedMaterial.costPerSqFt;
      const cost = costPerSqFt * squareFootage * amount;
      setTotalCost(cost);
      setError(''); // Clear any previous error
    } else {
      setError('Please fill in all fields with valid values');
      setTotalCost(0); // Reset total cost if error occurs
    }
  };

  const handleClose = (e) => {
    if (e.target === e.currentTarget) { // Only close if the overlay is clicked
      onClose();
    }
  };

  return (
    isCalculatorVisible && ( // Only render if isCalculatorVisible is true
      <>
        <div className="coverlay" onClick={handleClose}></div> {/* The overlay */}

        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h1>Assessment Calculator</h1>

          <div>
            <label>
              Square Footage:
              <input
                type="number"
                value={squareFootage}
                onChange={(e) => setSquareFootage(Number(e.target.value))}
                min="1"
                placeholder="Enter square footage"
              />
            </label>
          </div>

          <div>
            <label>
              Select Material:
              <select
                onChange={(e) => setSelectedMaterial(materials.find((m) => m.id === e.target.value))}
                value={selectedMaterial?.id || ''}
              >
                <option value="">Select Material</option>
                {materials && materials.length > 0 ? (
                  materials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.name}
                    </option>
                  ))
                ) : (
                  <option value="">No materials available</option>
                )}
              </select>
            </label>
          </div>

          <div>
            <label>
              Amount of Resources:
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="1"
                placeholder="Enter amount"
              />
            </label>
          </div>

          <button onClick={handleCalculate}>Calculate</button>

          {error && <div className="error-message">{error}</div>}

          {totalCost > 0 && !error && (
            <div>
              <h2>Total Cost: ${totalCost.toFixed(2)}</h2>
            </div>
          )}

          <button onClick={onClose}>Close</button>
        </div>
      </>
    )
  );
};

export default AssessmentCalculator;
