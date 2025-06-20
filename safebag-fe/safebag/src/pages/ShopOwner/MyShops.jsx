import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Header from "../../components/Header";
import "../../styles/MyShops.css";
import { Button, Tabs, Tab, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

export const MyShops = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [selectedTab, setSelectedTab] = useState("ACTIVE");

  const StatusColor = (status) => {
    if (status === "PENDING") return "#FFA500";
    if (status === "ACTIVE") return "#28a745";
    if (status === "REJECTED") return "#dc3545";
  };

  useEffect(() => {
    const fetchMyShops = async () => {
      const response = await axios.get(
        "http://localhost:8080/api/shops/myshops",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setShops(response.data);
    };

    fetchMyShops();
  }, []);

  const filteredShops = shops.filter((shop) => shop.status === selectedTab);

  return (
    <div>
      <Header />
      <div className="title">
        <h2>My Shops</h2>
      </div>

      <Tabs
        value={selectedTab}
        onChange={(e, newValue) => setSelectedTab(newValue)}
        centered
        textColor="primary"
        indicatorColor="primary"
        sx={{
          marginBottom: 3,
          width: "100%",
        }}
      >
        <Tab
          label="Active"
          value="ACTIVE"
          sx={{
            fontWeight: selectedTab === "ACTIVE" ? "bold" : "normal",
          }}
        />
        <Tab
          label="Pending"
          value="PENDING"
          sx={{
            fontWeight: selectedTab === "PENDING" ? "bold" : "normal",
          }}
        />
        <Tab
          label="Rejected"
          value="REJECTED"
          sx={{
            fontWeight: selectedTab === "REJECTED" ? "bold" : "normal",
          }}
        />
      </Tabs>

      <TableContainer
        component={Paper}
        sx={{ maxWidth: 1200, margin: "0 auto" }}
      >
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow className="table-row">
              <TableCell className="table-cell" align="center">
                Shop Name
              </TableCell>
              <TableCell className="table-cell" align="center">
                City
              </TableCell>
              <TableCell className="table-cell" align="center">
                Country
              </TableCell>
              <TableCell className="table-cell" align="center">
                Capacity
              </TableCell>
              <TableCell className="table-cell" align="center">
                Status
              </TableCell>
              <TableCell className="table-cell" align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredShops.map((shop) => (
              <TableRow key={shop.id}>
                <TableCell align="center">{shop.name}</TableCell>
                <TableCell align="center">{shop.city}</TableCell>
                <TableCell align="center">{shop.country}</TableCell>
                <TableCell align="center">{shop.capacity}</TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: StatusColor(shop.status),
                    fontWeight: "bold",
                  }}
                >
                  {shop.status}
                </TableCell>
                <TableCell align="center" className="table-cell">
                  <Button
                    className="detail-btn"
                    variant="outlined"
                    onClick={() => navigate(`/shopowner-myshops/${shop.id}`)}
                  >
                    View Details
                  </Button>
                  {(shop.status === "ACTIVE" || shop.status === "PENDING") && (
                    <Button
                      className="edit-btn"
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        navigate(`/shopowner-myshops/edit/${shop.id}`)
                      }
                    >
                      Edit Shop
                      <EditIcon fontSize="small" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {filteredShops.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Alert severity="info" variant="outlined">
                    No {selectedTab.toLowerCase()} shops found.
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

export default MyShops;
