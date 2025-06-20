import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import axios from "axios";
import "../../styles/AdminPage.css";

export const ShopOwnerControlPage = () => {
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admin/users/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // SHOPOWNER
      const shopOwners = response.data.filter(
        (user) => user.role === "SHOPOWNER"
      );
      setUsers(shopOwners);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewDetails = (publicId) => {
    navigate(`/admin-user-information/${publicId}`);
  };

  return (
    <div>
      <Header />
      <div className="page-title">
        <h2>Manage Shop Owners</h2>
      </div>

      {successMessage && (
        <div style={{ maxWidth: 1200, margin: "0 auto", marginBottom: 16 }}>
          <Alert severity="success">{successMessage}</Alert>
        </div>
      )}

      <TableContainer
        component={Paper}
        className="table-container"
        sx={{ maxWidth: 1200, margin: "0 auto" }}
      >
        <Table className="custom-table" sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow className="table-row">
              <TableCell className="table-cell" align="center">
                Full Name
              </TableCell>
              <TableCell className="table-cell" align="center">
                Email
              </TableCell>
              <TableCell className="table-cell" align="center">
                Tax Number
              </TableCell>
              <TableCell className="table-cell" align="center">
                Role
              </TableCell>
              <TableCell className="table-cell" align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.publicId}>
                  <TableCell className="table-cell" align="center">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell className="table-cell" align="center">
                    {user.email}
                  </TableCell>
                  <TableCell className="table-cell" align="center">
                    {user.taxNumber || "N/A"}
                  </TableCell>
                  <TableCell
                    className="table-cell"
                    align="center"
                    style={{
                      color: "#28a745",
                      fontWeight: "bold",
                    }}
                  >
                    {user.role}
                  </TableCell>
                  <TableCell className="table-cell" align="center">
                    <Button
                      className="detail-btn"
                      variant="outlined"
                      onClick={() => handleViewDetails(user.publicId)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Alert severity="info" variant="outlined">
                    No shop owners found.
                  </Alert>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
