import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
// import './UpdateCard.css';

function UpdateAmbulance({ onUpdate }) {
  const { hospitalId, ambulanceIndex } = useParams();  // Destructure hospitalId and labIndex from URL params
  const [hospital, setHospital] = useState(null);
  const [updatedLab, setUpdatedLab] = useState('');

  useEffect(() => {
    // Fetch the hospital data
    axios.get(`http://localhost:3000/api/auth/getHospitalsById?hospitalId=${hospitalId}`)
      .then((res) => {
        setHospital(res.data.data);
        setUpdatedLab(res.data.data.ambulance[ambulanceIndex] || '');  // Initialize updatedLab with the current lab value
      })
      .catch((error) => {
        console.error("Error fetching hospital:", error);
      });
  }, [hospitalId, ambulanceIndex]);

  const handleChange = (e) => {
    setUpdatedLab(e.target.value);  // Directly update the lab value (since it's a string)
  };

 
  // for specific data
  const handleSubmit = () => {
    if (hospital) {
      // Ensure that labIndex is valid and within bounds
      if (hospital.ambulance && ambulanceIndex >= 0 && ambulanceIndex < hospital.ambulance.length) {
        // Use the updatedLab from the state instead of fetching it again
        axios.put(
          `http://localhost:3000/api/auth/updateAmbulance?hospitalId=${hospitalId}&ambulanceIndex=${ambulanceIndex}`, 
          { ambulance: updatedLab },  // Send the updated lab from the state
          {
            headers: {
              // Authorization: "Bearer " + localStorage.getItem("token")
            },
          }
        )
        .then((res) => {
          onUpdate(res.data.hospital);  // Call onUpdate to refresh the hospital data
          alert("Lab updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating lab:", error);
        });
      } else {
        console.error("Invalid labIndex or labs not available.");
        alert("Could not update the lab. Invalid labIndex or no labs available.");
      }
    } else {
      console.error("Hospital data is not available.");
      alert("Hospital data is not available.");
    }
  };


  if (!hospital) {
    return <Typography variant="h4" className="loading">Loading...</Typography>;
  }

  return (
    <Card className="update-card">
      <Typography variant="h5" className="update-title">Update Lab</Typography>
      <TextField
        name="ambulance"
        label={`Hospital ${parseInt(ambulanceIndex) + 1} Name`}  // Display lab number
        value={updatedLab}
        onChange={handleChange}  // Handle changes to the lab string
        className="input-field"
      />
      <Button onClick={handleSubmit} variant="contained" className="update-button">Update</Button>
    </Card>
  );
}

export default UpdateAmbulance;
