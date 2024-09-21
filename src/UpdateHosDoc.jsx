import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';

function UpdateHosDoc({ onUpdate }) {
  const { hospitalId, doctorUsername } = useParams();  // Use doctorUsername from the URL params
  const [hospital, setHospital] = useState(null);
  const [updatedDoctor, setUpdatedDoctor] = useState({
    doctorName: '',
    phoneNumber: '',
    profileUrl: '',
    specialization: '',
    address: '',
    department: ''
  });

  useEffect(() => {
    // Fetch the hospital data and pre-fill the form with the selected doctor's details
    axios.get(`http://localhost:3000/api/auth/getHospitalsById?hospitalId=${hospitalId}`)
      .then((res) => {
        setHospital(res.data.data);
        const doctor = res.data.data.listOfDoctors.find(doc => doc.doctorUsername === doctorUsername);
        if (doctor) {
          setUpdatedDoctor({
            doctorName: doctor.doctorName || '',
            phoneNumber: doctor.phoneNumber || '',
            profileUrl: doctor.profileUrl || '',
            specialization: doctor.specialization || '',
            address: doctor.address || '',
            department: doctor.department || ''
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching hospital:", error);
      });
  }, [hospitalId, doctorUsername]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDoctor((prevDoctor) => ({
      ...prevDoctor,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Send the updated doctor data to the backend
    axios.put(
      `http://localhost:3000/api/auth/updateDoctor?hospitalId=${hospitalId}&doctorUsername=${doctorUsername}`, 
      updatedDoctor,  // Send the updated doctor object
      {
        headers: {
          // Authorization: "Bearer " + localStorage.getItem("token")
        },
      }
    )
    .then((res) => {
      onUpdate(res.data.hospital);  // Call onUpdate to refresh the hospital data
      alert("Doctor updated successfully!");
    })
    .catch((error) => {
      console.error("Error updating doctor:", error);
    });
  };

  if (!hospital) {
    return <Typography variant="h4" className="loading">Loading...</Typography>;
  }

  return (
    <Card className="update-card">
      <Typography variant="h5" className="update-title">Update Doctor</Typography>
      <TextField
        name="doctorName"
        label="Doctor Name"
        value={updatedDoctor.doctorName}
        onChange={handleChange}
        className="input-field"
      />
      <TextField
        name="phoneNumber"
        label="Phone Number"
        value={updatedDoctor.phoneNumber}
        onChange={handleChange}
        className="input-field"
        style={{ marginTop: '10px' }}
      />
      <TextField
        name="profileUrl"
        label="Profile URL"
        value={updatedDoctor.profileUrl}
        onChange={handleChange}
        className="input-field"
        style={{ marginTop: '10px' }}
      />
      <TextField
        name="specialization"
        label="Specialization"
        value={updatedDoctor.specialization}
        onChange={handleChange}
        className="input-field"
        style={{ marginTop: '10px' }}
      />
      <TextField
        name="address"
        label="Address"
        value={updatedDoctor.address}
        onChange={handleChange}
        className="input-field"
        style={{ marginTop: '10px' }}
      />
      <TextField
        name="department"
        label="Department"
        value={updatedDoctor.department}
        onChange={handleChange}
        className="input-field"
        style={{ marginTop: '10px' }}
      />
      <Button onClick={handleSubmit} variant="contained" className="update-button" style={{ marginTop: '20px' }}>
        Update
      </Button>
    </Card>
  );
}

export default UpdateHosDoc;
