import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
// import './UpdateCard.css';

function UpdateCardLab({ onUpdate }) {
  const { hospitalId, labIndex } = useParams();  // Destructure hospitalId and labIndex from URL params
  const [hospital, setHospital] = useState(null);
  const [updatedLab, setUpdatedLab] = useState('');

  useEffect(() => {
    // Fetch the hospital data
    axios.get(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_GET_HOSPITAL_BY_ID}?hospitalId=${hospitalId}`)
      .then((res) => {
        setHospital(res.data.data);
        setUpdatedLab(res.data.data.labs[labIndex] || '');  // Initialize updatedLab with the current lab value
      })
      .catch((error) => {
        console.error("Error fetching hospital:", error);
      });
  }, [hospitalId, labIndex]);

  const handleChange = (e) => {
    setUpdatedLab(e.target.value);  // Directly update the lab value (since it's a string)
  };

 
  // for specific data
  const handleSubmit = () => {
    if (hospital) {
      // Ensure that labIndex is valid and within bounds
      if (hospital.labs && labIndex >= 0 && labIndex < hospital.labs.length) {
        // Use the updatedLab from the state instead of fetching it again
        axios.put(
          `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_UPDATE_LABS}?hospitalId=${hospitalId}&labIndex=${labIndex}`, 
          { labs: updatedLab },  // Send the updated lab from the state
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
        name="lab"
        label={`Lab ${parseInt(labIndex) + 1} Name`}  // Display lab number
        value={updatedLab}
        onChange={handleChange}  // Handle changes to the lab string
        className="input-field"
      />
      <Button onClick={handleSubmit} variant="contained" className="update-button">Update</Button>
    </Card>
  );
}

export default UpdateCardLab;
