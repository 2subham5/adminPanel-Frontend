import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';

function UpdateDept({ onUpdate }) {
  const { hospitalId, deptIndex } = useParams(); // Destructure hospitalId and deptIndex from URL params
  const [hospital, setHospital] = useState(null);
  const [updatedDept, setUpdatedDept] = useState('');

  useEffect(() => {
    // Fetch the hospital data
    axios.get(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_GET_HOSPITAL_BY_ID}?hospitalId=${hospitalId}`)
      .then((res) => {
        setHospital(res.data.data);
        setUpdatedDept(res.data.data.depts[deptIndex] || ''); // Initialize updatedDept with the current department value
      })
      .catch((error) => {
        console.error("Error fetching hospital:", error);
      });
  }, [hospitalId, deptIndex]);

  const handleChange = (e) => {
    setUpdatedDept(e.target.value); // Update the department value
  };

  const handleSubmit = () => {
    if (hospital) {
      // Ensure deptIndex is valid and within bounds
      if (hospital.depts && deptIndex >= 0 && deptIndex < hospital.depts.length) {
        axios.put(
          `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_UPDATE_DEPTS}?hospitalId=${hospitalId}&deptIndex=${deptIndex}`,
          { depts: updatedDept }, // Send the updated department value
          {
            headers: {
              // Authorization: "Bearer " + localStorage.getItem("token")
            },
          }
        )
          .then((res) => {
            onUpdate(res.data.hospital); // Call onUpdate to refresh the hospital data
            alert("Department updated successfully!");
          })
          .catch((error) => {
            console.error("Error updating department:", error);
          });
      } else {
        console.error("Invalid deptIndex or departments not available.");
        alert("Could not update the department. Invalid deptIndex or no departments available.");
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
      <Typography variant="h5" className="update-title">Update Department</Typography>
      <TextField
        name="dept"
        label={`Department ${parseInt(deptIndex) + 1} Name`} // Display department number
        value={updatedDept}
        onChange={handleChange} // Handle changes to the department string
        className="input-field"
      />
      <Button onClick={handleSubmit} variant="contained" className="update-button">Update</Button>
    </Card>
  );
}

export default UpdateDept;
