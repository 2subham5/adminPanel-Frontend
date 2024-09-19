
import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Appbar from "./Appbar";
import Button from '@mui/material/Button';
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Hospital.css";
// update single data
function Hospital({ userType, userName, setUserName }) {
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const { hospitalId } = useParams();
console.log(hospitalId);
  useEffect(() => {
    axios.get(`http://localhost:3000/api/auth/getHospitalsById?hospitalId=${hospitalId}`, {
      headers: {
        // Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        setHospital(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching hospitals:", error);
      });
  }, [hospitalId]);

  const handleUpdate = (updatedHospital) => {
    setHospital(updatedHospital);
  };

  if (!hospital) {
    return <Typography variant="h4" className="loading">Loading...</Typography>;
  }

  return (
    <div className="hospital-page">
    {userType === "admin" || userType === "user" ? (
        <Appbar userName={userName} setUserName={setUserName} />
      ) : null}
      <Typography variant="h3" className="page-title">HOSPITAL</Typography>
      <div className="hospital-content">
        <Card className="hospital-card">
          <Typography variant="h4" className="hospital-name">{hospital.name}</Typography>
          <Typography variant="h5" className="hospital-address">{hospital.email}</Typography>
          <Typography variant="h5" className="hospital-address">{hospital.phoneNumber}</Typography>
          <Typography variant="h5" className="hospital-address">{hospital.address}</Typography>
        </Card>
        <UpdateCard hospital={hospital} onUpdate={handleUpdate} />
      </div>
        {/* {JSON.stringify(hospital)} */}
    </div>
  );
}

function UpdateCard({ hospital, onUpdate }) {
  const { hospitalId } = useParams();
  const [updatedHospital, setUpdatedHospital] = useState({
    name: hospital.name,
    email: hospital.email,
    phoneNumber: hospital.phoneNumber,
    address: hospital.address
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedHospital((prevHospital) => ({
      ...prevHospital,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    axios.post(`http://localhost:3000/api/auth/update?hospitalId=${hospitalId}`, updatedHospital, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        onUpdate(res.data.hospital);
        alert("Hospital updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating hospital:", error);
      });
  };

  return (
    <Card className="update-card">
      <Typography variant="h5" className="update-title">Update Hospital</Typography>
      <TextField
        name="name"
        label="Hospital Name"
        value={updatedHospital.name}
        onChange={handleChange}
        className="input-field"
      />
      <TextField
        name="email"
        label="Email"
        value={updatedHospital.email}
        onChange={handleChange}
        className="input-field"
      />
      <TextField
        name="address"
        label="Address"
        value={updatedHospital.address}
        onChange={handleChange}
        className="input-field"
      />
      <TextField
        name="Phone Number"
        label="Phone Number"
        value={updatedHospital.phoneNumber}
        onChange={handleChange}
        className="input-field"
      />
      <Button onClick={handleSubmit} variant="contained" className="update-button">Update</Button>
    </Card>
  );
}

export default Hospital;