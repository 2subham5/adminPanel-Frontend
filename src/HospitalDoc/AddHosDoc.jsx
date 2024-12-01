import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { useState } from "react";
import axios from "axios";
import Appbar from "../Appbar";
import { useParams } from "react-router-dom";

function AddHosDoc({ userType, userName, setUserName }) {
  const [doctorName, setDoctorName] = useState("");
  const [doctorUsername, setDoctorUsername] = useState(""); // New field for doctorUsername
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileUrl, setProfileUrl] = useState(""); // New field for profileUrl
  const [specialization, setSpecialization] = useState("");
  const [address, setAddress] = useState(""); // New field for address
  const [department, setDepartment] = useState("");
  const { hospitalId } = useParams(); // Get hospitalId from URL

  // Function to handle adding a new doctor
  const handleSubmit = async () => {
    if (!doctorName || !doctorUsername || !phoneNumber || !specialization || !address || !department) {
      alert("Please fill in all the fields.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/addDoctor?hospitalId=${hospitalId}`, 
        {
          doctorName,
          doctorUsername,
          phoneNumber,
          profileUrl, // This can be optional if it's not required
          specialization,
          address,
          department
        }, 
        {
          headers: {
            // "Authorization": "Bearer " + localStorage.getItem("token")
          }
        }
      );

      if (response.data.success) {
        alert("Doctor added successfully!");
        // Clear the input fields after successful submission
        setDoctorName("");
        setDoctorUsername("");
        setPhoneNumber("");
        setProfileUrl("");
        setSpecialization("");
        setAddress("");
        setDepartment("");
      } else {
        alert("Error adding doctor: " + response.data.message);
      }
    } catch (error) {
      alert("Error adding doctor. Please try again.");
      console.error("Error adding doctor:", error);
    }
  };

  return (
    <div className="add-doctor-container">
      {userType === "admin" || userType === "user" ? (
        <Appbar userName={userName} setUserName={setUserName} />
      ) : null}
      <div className="add-doctor-form-container">
        <Card variant="outlined" className="add-doctor-card">
          <h2 className="add-doctor-title">Add New Doctor</h2>
          <TextField
            onChange={(e) => setDoctorName(e.target.value)}
            fullWidth
            label="Doctor Name"
            variant="outlined"
            className="input-field"
            value={doctorName}
          />
          <TextField
            onChange={(e) => setDoctorUsername(e.target.value)}
            fullWidth
            label="Doctor Username"
            variant="outlined"
            className="input-field"
            value={doctorUsername}
          />
          <TextField
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            label="Phone Number"
            variant="outlined"
            className="input-field"
            value={phoneNumber}
          />
          <TextField
            onChange={(e) => setProfileUrl(e.target.value)}
            fullWidth
            label="Profile URL"
            variant="outlined"
            className="input-field"
            value={profileUrl}
          />
          <TextField
            onChange={(e) => setSpecialization(e.target.value)}
            fullWidth
            label="Specialization"
            variant="outlined"
            className="input-field"
            value={specialization}
          />
          <TextField
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            label="Address"
            variant="outlined"
            className="input-field"
            value={address}
          />
          <TextField
            onChange={(e) => setDepartment(e.target.value)}
            fullWidth
            label="Department"
            variant="outlined"
            className="input-field"
            value={department}
          />
          <Button
            size="large"
            variant="contained"
            onClick={handleSubmit}
            className="submit-button"
          >
            Add New Doctor
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default AddHosDoc;
