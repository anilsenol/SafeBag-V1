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
import axios from "axios";
import "../../styles/ShopOwnerMain.css";
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import { Tabs, Tab } from "@mui/material";

export const ShopOwnerMain = () => {
  const [reservations, setReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const StatusColor = (status) => {
    if (status === "CANCELED") return "#FFA500";
    if (status === "ACTIVE") return "#28a745";
    if (status === "EXPIRED") return "#dc3545";
  };

  const handleCancel = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/reservation/cancel/${selectedReservation.reservationNumber}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenModal(false);

      setReservations((prev) =>
        prev.map((res) =>
          res.reservationNumber === selectedReservation.reservationNumber
            ? { ...res, status: "CANCELED" }
            : res
        )
      );
    } catch (error) {
      console.error("Cancel failed:", error);
    }
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/reservation/shop/myreservations",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const filtered = response.data.filter((r) => r.status === statusFilter);
        setReservations(filtered);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, [statusFilter]);

  return (
    <div>
      <Header />
      <div className="title">
        <h2>Reservations</h2>
      </div>

      <Tabs
        value={statusFilter}
        onChange={(e, newValue) => setStatusFilter(newValue)}
        centered
        textColor="primary"
        indicatorColor="primary"
        sx={{ marginBottom: 3 }}
      >
        <Tab
          label="Active"
          value="ACTIVE"
          sx={{
            fontWeight: statusFilter === "ACTIVE" ? "bold" : "normal",
          }}
        />
        <Tab
          label="Canceled"
          value="CANCELED"
          sx={{
            fontWeight: statusFilter === "CANCELED" ? "bold" : "normal",
          }}
        />
        <Tab
          label="Expired"
          value="EXPIRED"
          sx={{
            fontWeight: statusFilter === "EXPIRED" ? "bold" : "normal",
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
                Reservation Number
              </TableCell>
              <TableCell className="table-cell" align="center">
                Shop Name
              </TableCell>
              <TableCell className="table-cell" align="center">
                Date
              </TableCell>
              <TableCell className="table-cell" align="center">
                Bag Count
              </TableCell>
              <TableCell className="table-cell" align="center">
                Start Time
              </TableCell>
              <TableCell className="table-cell" align="center">
                End Time
              </TableCell>
              <TableCell className="table-cell" align="center">
                Status
              </TableCell>
              <TableCell className="table-cell" align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((res) => (
              <TableRow key={res.reservationNumber}>
                <TableCell align="center">{res.reservationNumber}</TableCell>
                <TableCell align="center">{res.shop.name}</TableCell>
                <TableCell align="center">{res.reservationDate}</TableCell>
                <TableCell align="center">{res.bagCount}</TableCell>
                <TableCell align="center">
                  {res.startTime.slice(0, 5)}
                </TableCell>
                <TableCell align="center">{res.endTime.slice(0, 5)}</TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: StatusColor(res.status),
                    fontWeight: "bold",
                  }}
                >
                  {res.status}
                </TableCell>
                <TableCell align="center">
                  <Button>Rezervasyonu uzat</Button>
                </TableCell>
                <TableCell className="table-cell" align="center">
                  <Button
                    className="detail-btn "
                    variant="outlined"
                    onClick={() => {
                      setSelectedReservation(res);
                      setOpenModal(true);
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {reservations.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Alert severity="info" variant="outlined">
                    You don't have any {statusFilter.toLowerCase()}{" "}
                    reservations.
                  </Alert>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {openModal && selectedReservation && (
        <div className="reservation-modal-container">
          <div className="reservation-details-modal">
            <button
              className="close-icon-btn"
              onClick={() => setOpenModal(false)}
            >
              <CloseIcon />
            </button>
            <h2>Reservation {selectedReservation.reservationNumber}</h2>
            <p>
              <strong>Shop Name:</strong> {selectedReservation.shop?.name}
            </p>
            <p>
              <strong>Date:</strong> {selectedReservation.reservationDate}
            </p>
            <p>
              <strong>Bag Count:</strong> {selectedReservation.bagCount}
            </p>
            <p>
              <strong>Start Time:</strong>{" "}
              {selectedReservation.startTime.slice(0, 5)}
            </p>
            <p>
              <strong>End Time:</strong>{" "}
              {selectedReservation.endTime.slice(0, 5)}
            </p>
            <p>
              <strong>Status:</strong>
              <span
                style={{
                  color: StatusColor(selectedReservation.status),
                  fontWeight: "bold",
                }}
              >
                {selectedReservation.status}
              </span>
            </p>

            {selectedReservation.status === "ACTIVE" && (
              <div className="cancel-div">
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel Reservation
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopOwnerMain;
