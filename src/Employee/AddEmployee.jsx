

import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { useState } from "react";
import axios from "axios";
import Appbar from "../Appbar";
import "./css/AddEmployee.css";

function AddEmployee({ userType, userName, setUserName }) {
    const [name, setName] = useState("");
    const [designation, setDesignation] = useState("");
    const [csvFile, setCsvFile] = useState(null);
    const handleSubmit = async () => {
        const formData = new FormData();

        if (csvFile) {
            formData.append("file", csvFile);
            try {
                await axios.post(`${import.meta.env.VITE_EMPLOYEE_UPLOAD}`, formData, {
                    headers: {
                        // "Authorization": "Bearer " + localStorage.getItem("token"),
                        "Content-Type": "multipart/form-data"
                    }
                });
                alert("Employee added successfully from CSV file!");
                setCsvFile(null);  // Clear the file input after successful submission
            } catch (error) {
                alert("Error uploading CSV file. Please try again.");
                console.error("Error uploading CSV file:", error);
            }
        } else {
            try {
                await axios.post(`${import.meta.env.VITE_EMPLOYEE_ADMIN}`, {
                    name: name,
                    designation: designation,
                    published: true,
                }, {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });
                alert("Employee added successfully!");
                // Clear form fields after successful submission
                setName("");
                setDesignation("");
            } catch (error) {
                alert("Error adding employee. Please try again.");
                console.error("Error adding employee:", error);
            }
        }
    };

    return (
        <div className="add-employee-container">
            {/* {userType === "admin" || userType === "user" ? ( */}
                <Appbar userName={userName} setUserName={setUserName} />
            {/* ) : null} */}
            <div className="add-employee-form-container">
                <Card variant="outlined" className="add-employee-card">
                    <h2 className="add-employee-title">Add New Employee</h2>
                    <TextField
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        label="Name"
                        variant="outlined"
                        className="input-field"
                        value={name}
                        disabled={!!csvFile}
                    />
                    <TextField
                        onChange={(e) => setDesignation(e.target.value)}
                        fullWidth
                        label="Designation"
                        variant="outlined"
                        className="input-field"
                        value={designation}
                        disabled={!!csvFile}
                    />
                      <div className="upload-csv-container">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={(e) => setCsvFile(e.target.files[0])}
                        />
                    </div>
                    <Button
                        size="large"
                        variant="contained"
                        onClick={handleSubmit}
                        className="submit-button"
                    >
                         {csvFile ? "Upload CSV" : "Add Employee"}
                    </Button>
                </Card>
            </div>
        </div>
    );
}

export default AddEmployee;