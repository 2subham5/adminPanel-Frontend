import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { useState } from "react";
import axios from "axios";
import Appbar from "./Appbar";
import { useParams } from "react-router-dom";
// import "./AddLab.css";

function AddLab({ userType, userName, setUserName }) {
    const [lab, setLab] = useState("");
    const {hospitalId} =useParams();
    // Function to handle adding a new lab
    const handleSubmit = async () => {
        if (!lab) {
            alert("Please enter a lab name.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:3000/api/auth/addLabs?hospitalId=${hospitalId}`, {
                labs: lab,
            }, {
                headers: {
                    // "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });

            if (response.data.success) {
                alert("Lab added successfully!");
                setLab(""); // Clear the input field after successful submission
            } else {
                alert("Error adding lab: " + response.data.message);
            }
        } catch (error) {
            alert("Error adding lab. Please try again.");
            console.error("Error adding lab:", error);
        }
    };

    return (
        <div className="add-lab-container">
            {userType === "admin" || userType === "user" ? (
                <Appbar userName={userName} setUserName={setUserName} />
            ) : null}
            <div className="add-lab-form-container">
                <Card variant="outlined" className="add-lab-card">
                    <h2 className="add-lab-title">Add New Lab</h2>
                    <TextField
                        onChange={(e) => setLab(e.target.value)}
                        fullWidth
                        label="Lab Name"
                        variant="outlined"
                        className="input-field"
                        value={lab}
                    />
                    <Button
                        size="large"
                        variant="contained"
                        onClick={handleSubmit}
                        className="submit-button"
                    >
                        Add Lab
                    </Button>
                </Card>
            </div>
        </div>
    );
}

export default AddLab;
