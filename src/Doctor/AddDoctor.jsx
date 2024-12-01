

import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { useState } from "react";
import axios from "axios";
import Appbar from "../Appbar";
import "./css/AddDoctor.css";

function AddDoctor({ userType, userName, setUserName }) {
    const [name, setName] = useState("");
    const [degree, setDegree] = useState("");
    const [reg, setReg] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");
    const [csvFile, setCsvFile] = useState(null);
    // const handleSubmit = async () => {
    //     try {
    //         await axios.post("http://localhost:3000/admin/doctor", {
    //             doctorName: name,
    //             degree: degree,
    //             imgLink: image,
    //             reg: reg,
    //             category: category,
    //             published: true,
    //         }, {
    //             headers: {
    //                 "Authorization": "Bearer " + localStorage.getItem("token")
    //             }
    //         });
    //         alert("Doctor added successfully!");
    //         // Clear form fields after successful submission
    //         setName("");
    //         setDegree("");
    //         setReg("");
    //         setCategory("");
    //         setImage("");
    //     } catch (error) {
    //         alert("Error adding doctor. Please try again.");
    //         console.error("Error adding doctor:", error);
    //     }
    // };
    const handleSubmit = async () => {
        const formData = new FormData();
        
        if (csvFile) {
            formData.append("file", csvFile);
            try {
                await axios.post("http://localhost:3000/api/upload/file", formData, {
                    headers: {
                        // "Authorization": "Bearer " + localStorage.getItem("token"),
                        "Content-Type": "multipart/form-data"
                    }
                });
                alert("Doctors added successfully from CSV file!");
                setCsvFile(null);  // Clear the file input after successful submission
            } catch (error) {
                alert("Error uploading CSV file. Please try again.");
                console.error("Error uploading CSV file:", error);
            }
        } else {
            try {
                await axios.post("http://localhost:3000/admin/doctor", {
                    doctorName: name,
                    degree: degree,
                    imgLink: image,
                    reg: reg,
                    category: category,
                    published: true,
                }, {
                    headers: {
                        // "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });
                alert("Doctor added successfully!");
                // Clear form fields after successful submission
                setName("");
                setDegree("");
                setReg("");
                setCategory("");
                setImage("");
            } catch (error) {
                alert("Error adding doctor. Please try again.");
                console.error("Error adding doctor:", error);
            }
        }
    };
    return (
        <div className="add-doctor-container">
            {/* {userType === "admin" || userType === "user" ? ( */}
            <Appbar userName={userName} setUserName={setUserName} />
            {/* ) : null} */}
            <div className="add-doctor-form-container">
                <Card variant="outlined" className="add-doctor-card">
                    <h2 className="add-doctor-title">Add New Doctor</h2>
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
                        onChange={(e) => setDegree(e.target.value)}
                        fullWidth
                        label="Degree"
                        variant="outlined"
                        className="input-field"
                        value={degree}
                        disabled={!!csvFile}
                    />
                    <TextField
                        onChange={(e) => setImage(e.target.value)}
                        fullWidth
                        label="Image URL"
                        variant="outlined"
                        className="input-field"
                        value={image}
                        disabled={!!csvFile}
                    />
                    <TextField
                        onChange={(e) => setReg(e.target.value)}
                        fullWidth
                        label="Registration No."
                        variant="outlined"
                        className="input-field"
                        value={reg}
                        disabled={!!csvFile}
                    />
                    <TextField
                        onChange={(e) => setCategory(e.target.value)}
                        fullWidth
                        label="Specialization"
                        variant="outlined"
                        className="input-field"
                        value={category}
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
                         {csvFile ? "Upload CSV" : "Add Doctor"}
                    </Button>
                </Card>
            </div>
        </div>
    );
}

export default AddDoctor;