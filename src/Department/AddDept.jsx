import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { useState } from "react";
import axios from "axios";
import Appbar from "../Appbar";
import { useParams } from "react-router-dom";


function AddDept({ userType, userName, setUserName }) {
    const [dept, setDept] = useState(""); // Updated state for department
    const { hospitalId } = useParams();

    // Function to handle adding a new department
    const handleSubmit = async () => {
        if (!dept) {
            alert("Please enter a department name.");
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_ADD_DEPTS}?hospitalId=${hospitalId}`,
                { depts: dept }, // Updated payload for department
                {
                    headers: {
                        // "Authorization": "Bearer " + localStorage.getItem("token")
                    },
                }
            );

            if (response.data.success) {
                alert("Department added successfully!");
                setDept(""); // Clear the input field after successful submission
            } else {
                alert("Error adding department: " + response.data.message);
            }
        } catch (error) {
            alert("Error adding department. Please try again.");
            console.error("Error adding department:", error);
        }
    };

    return (
        <div className="add-dept-container">
            {userType === "admin" || userType === "user" ? (
                <Appbar userName={userName} setUserName={setUserName} />
            ) : null}
            <div className="add-dept-form-container">
                <Card variant="outlined" className="add-dept-card">
                    <h2 className="add-dept-title">Add New Department</h2>
                    <TextField
                        onChange={(e) => setDept(e.target.value)} // Update state for department
                        fullWidth
                        label="Department Name"
                        variant="outlined"
                        className="input-field"
                        value={dept}
                    />
                    <Button
                        size="large"
                        variant="contained"
                        onClick={handleSubmit}
                        className="submit-button"
                    >
                        Add Department
                    </Button>
                </Card>
            </div>
        </div>
    );
}

export default AddDept;
