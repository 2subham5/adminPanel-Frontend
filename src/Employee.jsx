
import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from '@mui/material/Card';
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Appbar from "./Appbar";
function Employee({ userType, userName, setUserName }) {
  const [employee, setEmployee] = useState(null);

  const { employeeId } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:3000/admin/employee/${employeeId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        setEmployee(res.data.employee);
      })
      .catch((error) => {
        console.error("Error fetching employee:", error);
      });
  }, [employeeId]);

  if (!employee) {
    return <Typography variant="h4">Loading...</Typography>;
  }

  return (
    <div>
      <div>
        {/* Conditionally render Appbar based on userType */}
        {userType === "admin" || userType === "user" ? (
          <Appbar userName={userName} setUserName={setUserName} />
        ) : null}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Card style={{ border: "2px solid black", margin: 10, width: 300 }}>
          <Typography variant="h4">Employee Details</Typography>
          <Typography variant="h6">Name: {employee.name}</Typography>
          <Typography variant="h6">Designation: {employee.designation}</Typography>
        </Card>
        <div>
          {/* inside the bracket it's the state */}
          <UpdateCard employee={employee} />
        </div>
      </div>
      </div>

      );
}




      // update card

      function UpdateCard({employee, onUpdate}) {
  const {employeeId} = useParams();

      const [updatedDoc, setUpdatedDoc] = useState({
        name: employee.name,
      designation: employee.designation,
    
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUpdatedDoc((prevDoc) => ({
        ...prevDoc,
        [name]: value,
    }));
  };

  const handleSubmit = () => {
        axios.put(`http://localhost:3000/admin/employee/${employeeId}`, updatedDoc, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })

          .then((res) => {
            onUpdate(res.data.employee);
            alert("Employee updated successfully!");
          })

          .catch((error) => {
            console.error("Error updating doctor:", error);
          });
  };

      return (
      <Card style={{
        border: "2px solid black",
        margin: 10,
        width: 300
      }}>
        <TextField
          name="name"
          label="Employee Name"
          value={updatedDoc.name}
          onChange={handleChange}
        />
        <TextField
          name="designation"
          label="Designation"
          value={updatedDoc.designation}
          onChange={handleChange}
        />
       
        <Button onClick={handleSubmit}>Update</Button>
      </Card>
      );
}




      export default Employee;
