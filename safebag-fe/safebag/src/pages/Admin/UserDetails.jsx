import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Button from "@mui/material/Button";
import axios from "axios";
import "../../styles/UserDetail.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

const UserDetails = () => {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [shops, setShops] = useState([]);
  const [error, setError] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [shopToDelete, setShopToDelete] = useState(null);

  const token = localStorage.getItem("token");

  const StatusColor = (status) => {
    if (status === "CANCELED") return "#FFA500";
    if (status === "ACTIVE") return "#28a745";
    if (status === "EXPIRED") return "#dc3545";
  };

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const resUser = await axios.get(
          `http://localhost:8080/api/admin/users/${publicId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userData = resUser.data;
        setUser(userData);

        if (userData.role === "TRAVELER") {
          const resReservations = await axios.get(
            `http://localhost:8080/api/admin/users/${publicId}/reservations`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setReservations(resReservations.data);
        } else if (userData.role === "SHOPOWNER") {
          const resShops = await axios.get(
            `http://localhost:8080/api/admin/users/${publicId}/shops`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setShops(resShops.data);

          const allReservations = [];
          for (const shop of resShops.data) {
            const resShopReservations = await axios.get(
              `http://localhost:8080/api/admin/shops/${shop.id}/reservations`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            allReservations.push(
              ...resShopReservations.data.map((r) => ({
                ...r,
                shopId: shop.id,
                shopName: shop.name,
              }))
            );
          }
          setReservations(allReservations);
        }
      } catch (err) {
        console.error(err);
        setError("Can't fetch the user informations");
      }
    };

    fetchUserDetail();
  }, [publicId]);

  const handleDeleteUser = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/admin/users/delete/${publicId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSnackbarMessage("User Deleted Successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      console.error(err);
      setSnackbarMessage("User Delete Failed.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setConfirmOpen(false);
    }
  };

  const handleDeleteShop = async (shopId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/admin/shops/delete/${shopId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSnackbarMessage("Shop Deleted Successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setShops(shops.filter((shop) => shop.id !== shopId));
      setReservations(reservations.filter((r) => r.shopId !== shopId));
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Shop Delete Failed.";
      setSnackbarMessage(msg);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <Header />
      <div className="page-title">
        <h2>User Details</h2>
      </div>

      {user ? (
        <div
          className="user-detail-container"
          style={{ maxWidth: 800, margin: "20px auto" }}
        >
          <p>
            <strong>Name Surname:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>

          {user.role === "TRAVELER" && (
            <>
              <h4>
                Reservations for {user.firstName} {user.lastName}
              </h4>
              {reservations.length > 0 ? (
                <ul>
                  {reservations.map((r) => (
                    <li key={r.id}>
                      <strong>{r.reservationNumber}</strong> /{" "}
                      {r.reservationDate} /
                      <span
                        style={{
                          color: StatusColor(r.status),
                          fontWeight: "bold",
                        }}
                      >
                        {r.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>There is no reservation for this traveler.</p>
              )}
            </>
          )}

          {user.role === "SHOPOWNER" && (
            <>
              <h4>Shops and Reservations</h4>
              {shops.length > 0 ? (
                shops.map((shop) => (
                  <div key={shop.id} style={{ marginBottom: "1rem" }}>
                    <p>
                      <strong>Shop:</strong> {shop.name}
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => handleDeleteShop(shop.id)}
                        style={{ marginLeft: "1rem" }}
                      >
                        Delete Shop
                      </Button>
                    </p>
                    <ul>
                      {reservations
                        .filter((r) => r.shopId === shop.id)
                        .map((r) => (
                          <li key={r.id}>
                            <span
                              style={{
                                color: StatusColor(r.status),
                                fontWeight: "bold",
                              }}
                            >
                              {r.status}
                            </span>{" "}
                            – {r.customerName}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p>Shop not found.</p>
              )}
            </>
          )}

          <div className="buttons">
            <Button
              variant="contained"
              onClick={handleBack}
              sx={{
                backgroundColor: "#01aa94",
                "&:hover": {
                  backgroundColor: "#026256",
                },
              }}
            >
              Back to the user list
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setConfirmOpen(true)}
            >
              Delete User
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <p>{error || "Loading user details..."}</p>
        </div>
      )}

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title" className="pop-up">
          Delete User
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete this user? This can't be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmOpen(false)}
            color="primary"
            sx={{
              backgroundColor: "#01aa94",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#026256",
              },
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default UserDetails;
