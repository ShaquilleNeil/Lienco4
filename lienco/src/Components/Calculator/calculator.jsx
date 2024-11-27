import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import your Firebase instance
import { collection, getDocs } from 'firebase/firestore';
import './calc.css';

const AssessmentCalculator = ({ isCalculatorVisible, onClose }) => {
  const [materials, setMaterials] = useState([]); // Default to an empty array
  const [squareFootage, setSquareFootage] = useState(0);
  const [materialSelections, setMaterialSelections] = useState([{ material: null }]); // Array to hold selected materials
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState('');

  // Fetch available materials from Firestore
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

  // Handle material selection change
  const handleMaterialChange = (index, value) => {
    const updatedSelections = [...materialSelections];
    updatedSelections[index].material = value;
    setMaterialSelections(updatedSelections);
  };

  // Add a new material selection
  const handleAddMaterial = () => {
    setMaterialSelections([...materialSelections, { material: null }]);
  };

  // Remove a material selection
  const handleRemoveMaterial = (index) => {
    const updatedSelections = materialSelections.filter((_, i) => i !== index);
    setMaterialSelections(updatedSelections);
  };

  // Handle calculation
  const handleCalculate = () => {
    if (squareFootage > 0 && materialSelections.every(selection => selection.material)) {
      let total = 0;
      materialSelections.forEach((selection) => {
        const material = materials.find((m) => m.id === selection.material);
        if (material) {
          total += material.costPerSqFt * squareFootage;
        }
      });
      setTotalCost(total);
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

          {/* Scrollable container for materials */}
          <div className="materials-container">
            {materialSelections.map((selection, index) => (
              <div key={index} className="material-selection">
                <div>
                  <label>
                    Select Material:
                    <select
                      value={selection.material || ''}
                      onChange={(e) => handleMaterialChange(index, e.target.value)}
                    >
                      <option value="">Select Material</option>
                      {materials.length > 0 ? (
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

                <button
                  type="button"
                  onClick={() => handleRemoveMaterial(index)}
                  className="small-button remove-button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddMaterial}
            className="small-button add-button"
          >
            Add Material
          </button>

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
