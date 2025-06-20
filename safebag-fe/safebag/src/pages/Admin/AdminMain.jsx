import React, { useEffect, useState } from "react";
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
import { Tabs, Tab } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import "../../styles/AdminPage.css";
import MapShow from "../../components/MapShow";

const AdminPage = () => {
  const [shops, setShops] = useState([]);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [openModal, setOpenModal] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchShops = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admin/shops/all",

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const filtered = response.data.filter(
        (shop) => shop.status === statusFilter
      );
      setShops(filtered);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [statusFilter]);

  const StatusColor = (status) => {
    if (status === "PENDING") return "#FFA500";
    if (status === "ACTIVE") return "#28a745";
    return "#6c757d";
  };

  const handleApprove = async (shopId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/shops/${shopId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccessMessage("Shop approved successfully!");
      setOpenModal(false);
      fetchShops();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error approving shop:", error);
    }
  };

  const handleReject = async (shopId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/shops/${shopId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccessMessage("Shop rejected!");
      setOpenModal(false);
      fetchShops();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error rejecting shop:", error);
    }
  };

  const handleDelete = async (shopId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/admin/shops/delete/${shopId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccessMessage("Shop deleted successfully!");
      setOpenModal(false);
      fetchShops();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting shop:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="page-title">
        <h2>Manage Shops</h2>
      </div>

      {successMessage && (
        <div style={{ maxWidth: 1200, margin: "0 auto", marginBottom: 16 }}>
          <Alert
            severity={successMessage.includes("rejected") ? "error" : "success"}
          >
            {successMessage}
          </Alert>
        </div>
      )}

      <Tabs
        value={statusFilter}
        onChange={(e, newValue) => setStatusFilter(newValue)}
        centered
        textColor="primary"
        indicatorColor="primary"
        sx={{ marginBottom: 3 }}
      >
        <Tab
          label="Pending"
          value="PENDING"
          sx={{
            fontWeight: statusFilter === "PENDING" ? "bold" : "normal",
          }}
        />
        <Tab
          label="Active"
          value="ACTIVE"
          sx={{
            fontWeight: statusFilter === "ACTIVE" ? "bold" : "normal",
          }}
        />
      </Tabs>

      <TableContainer
        component={Paper}
        className="table-container"
        sx={{ maxWidth: 1200, margin: "0 auto" }}
      >
        <Table className="custom-table" sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow className="table-row">
              <TableCell className="table-cell" align="center">
                Shop Name
              </TableCell>
              <TableCell className="table-cell" align="center">
                Owner
              </TableCell>
              <TableCell className="table-cell" align="center">
                City
              </TableCell>
              <TableCell className="table-cell" align="center">
                Status
              </TableCell>
              <TableCell className="table-cell" align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shops.length > 0 ? (
              shops.map((shop) => (
                <TableRow key={shop.id}>
                  <TableCell className="table-cell" align="center">
                    {shop.name}
                  </TableCell>
                  <TableCell className="table-cell" align="center">
                    {shop.ownerEmail}
                  </TableCell>
                  <TableCell className="table-cell" align="center">
                    {shop.city}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: StatusColor(shop.status),
                      fontWeight: "bold",
                    }}
                  >
                    {shop.status}
                  </TableCell>
                  <TableCell className="table-cell" align="center">
                    {shop.status === "PENDING" && (
                      <Button
                        className="detail-btn"
                        variant="outlined"
                        onClick={() => {
                          setSelectedShop(shop);
                          setOpenModal(true);
                        }}
                      >
                        View Details
                      </Button>
                    )}
                    {shop.status === "ACTIVE" && (
                      <Button
                        className="detail-btn"
                        variant="outlined"
                        onClick={() => {
                          setSelectedShop(shop);
                          setOpenModal(true);
                        }}
                      >
                        View Details
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Alert severity="info" variant="outlined">
                    No {statusFilter.toLowerCase()} shops found.
                  </Alert>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {openModal && selectedShop && (
        <div className="reservation-modal-container">
          <div className="reservation-details-modal">
            <button
              className="close-icon-btn"
              onClick={() => setOpenModal(false)}
            >
              <CloseIcon />
            </button>
            <h3 style={{ textAlign: "center" }}>Shop Details</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>
                <strong>Name:</strong> {selectedShop.name}
              </li>
              <li>
                <strong>Owner Email:</strong> {selectedShop.ownerEmail}
              </li>
              <li>
                <strong>Country:</strong> {selectedShop.country}
              </li>
              <li>
                <strong>City:</strong> {selectedShop.city}
              </li>
              <li>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      selectedShop.status === "APPROVED"
                        ? "green"
                        : selectedShop.status === "PENDING"
                        ? "orange"
                        : "gray",
                    fontWeight: "bold",
                  }}
                >
                  {selectedShop.status}
                </span>
              </li>
              <li>
                <strong>Address:</strong> {selectedShop.address}
              </li>
              <li>
                <strong>Address Description:</strong>{" "}
                {selectedShop.addressDescription}
              </li>
              <li>
                <strong>Opening Hour:</strong>{" "}
                {selectedShop.openingHour.slice(0, 5)}
              </li>
              <li>
                <strong>Closing Hour:</strong>{" "}
                {selectedShop.closingHour.slice(0, 5)}
              </li>
              <li>
                <strong>Capacity:</strong> {selectedShop.capacity}
              </li>
            </ul>

            {selectedShop.latitude && selectedShop.longitude && (
              <MapShow
                shops={[selectedShop]}
                center={{
                  lat: selectedShop.latitude,
                  lng: selectedShop.longitude,
                }}
                height="150px"
                width="100%"
                zoom={15}
              />
            )}

            <div
              className="buttons"
              style={{ marginTop: 20, textAlign: "center" }}
            >
              {selectedShop.status === "PENDING" ? (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleApprove(selectedShop.id)}
                    sx={{ marginRight: 2 }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleReject(selectedShop.id)}
                  >
                    Reject
                  </Button>
                </>
              ) : selectedShop.status === "ACTIVE" ? (
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(selectedShop.id)}
                >
                  Delete Shop
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
