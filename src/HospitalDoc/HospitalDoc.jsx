import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Appbar from "../Appbar";
import Button from '@mui/material/Button';
import { useParams, useNavigate } from "react-router-dom";
import { Typography, List, ListItem, ListItemText } from "@mui/material";
import "../Hospital/css/Hospital.css";

function HospitalDoc({ userType, userName, setUserName }) {
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

  const handleDeleteClick = (doctorUsername) => {
    // Confirm before deleting
    const confirmDelete = window.confirm("Are you sure you want to delete this doctor?");
    if (!confirmDelete) return;

    // Make a DELETE request to the backend
    axios
      .delete(`http://localhost:3000/api/auth/deleteDoctor?hospitalId=${hospitalId}&doctorUsername=${doctorUsername}`)
      .then((res) => {
        if (res.data.success) {
          // Remove the deleted doctor from the frontend state
          setHospital((prevHospital) => ({
            ...prevHospital,
            listOfDoctors: prevHospital.listOfDoctors.filter(doctor => doctor.doctorUsername !== doctorUsername),
          }));
        } else {
          console.error("Failed to delete doctor:", res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error deleting doctor:", error);
      });
  };

  const handleEditClick = (doctorUsername) => {
    // Navigate to the update doctor page with doctorUsername in the URL
    navigate(`/hospital/editDoctor/${hospitalId}/${doctorUsername}`);
  };

  return (
    <div className="hospital-page">
      {userType === "admin" || userType === "user" ? (
        <Appbar userName={userName} setUserName={setUserName} />
      ) : null}
      <Typography variant="h3" className="page-title">HOSPITAL</Typography>
      <div className="hospital-content">
        <Card className="hospital-card">
          {hospital && (
            <>
              <Typography variant="h4" className="hospital-name">{hospital.name}</Typography>

              <Typography variant="h6" className="labs-title">Doctors:</Typography>
              <List>
                {hospital.listOfDoctors && hospital.listOfDoctors.length > 0 ? (
                  hospital.listOfDoctors.map((doctor) => (
                    <ListItem key={doctor.doctorUsername}>
                      <ListItemText
                        primary={doctor.doctorName}
                        secondary={`${doctor.specialization} - ${doctor.department}`}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditClick(doctor.doctorUsername)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteClick(doctor.doctorUsername)}  
                        style={{ marginLeft: "10px" }}
                      >
                        Delete
                      </Button>
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body1">No Doctors Available</Typography>
                )}
              </List>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export default HospitalDoc;
