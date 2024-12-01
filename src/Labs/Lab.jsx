import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Appbar from "../Appbar";
import Button from '@mui/material/Button';
import { useParams, useNavigate } from "react-router-dom";
import { Typography, List, ListItem, ListItemText } from "@mui/material";
import "../Hospital/css/Hospital.css";

function Lab({ userType, userName, setUserName }) {
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

  const handleEditClick = (index) => {
    navigate(`/hospital/${hospitalId}/labs/${index}`);
  };
  const handleDeleteClick = (index) => {
    // Confirm before deleting
    const confirmDelete = window.confirm("Are you sure you want to delete this lab?");
    if (!confirmDelete) return;
  
    // Make a DELETE request to the backend
    axios.delete(`http://localhost:3000/api/auth/deleteLabs?hospitalId=${hospitalId}&labIndex=${index}`)
      .then((res) => {
        if (res.data.success) {
          // Remove the deleted lab from the frontend state
          setHospital((prevHospital) => ({
            ...prevHospital,
            labs: prevHospital.labs.filter((_, i) => i !== index),
          }));
        } else {
          console.error("Failed to delete lab:", res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error deleting lab:", error);
      });
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
          {/* <Typography variant="h5" className="hospital-email">{hospital.email}</Typography>
          <Typography variant="h5" className="hospital-phoneNumber">{hospital.phoneNumber}</Typography>
          <Typography variant="h5" className="hospital-address">{hospital.address}</Typography> */}
          
          <Typography variant="h6" className="labs-title">Labs:</Typography>
          <List>
            {hospital.labs && hospital.labs.length > 0 ? (
              hospital.labs.map((lab, index) => (
                <ListItem key={index}>
                  <ListItemText primary={lab} />
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleEditClick(index)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => handleDeleteClick(index)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </Button>
                </ListItem>
              ))
            ) : (
              <Typography variant="body1">No Labs Available</Typography>
            )}
          </List>
        </Card>
        {/* <UpdateCard hospital={hospital} onUpdate={handleUpdate} /> */}
      </div>
    </div>
  );
}


export default Lab;

