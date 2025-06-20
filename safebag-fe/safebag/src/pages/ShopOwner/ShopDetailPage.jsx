import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "../../styles/ShopDetailPage.css";
import { useNavigate } from "react-router-dom";

const ShopDetailPage = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const navigate = useNavigate();

  const statusStyle = (status) => {
    if (status === "ACTIVE") {
      return { color: "#28a745" };
    } else if (status === "PENDING") {
      return { color: "#FFA500" };
    }
    return {};
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/shops/myshops/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((shop) => {
        setShop(shop.data);
      })
      .catch((err) => {
        console.error("Error fetching shop:", err);
      });
  }, [id]);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:8080/api/shops/myshops/${id}/delete`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        alert("Shop deleted successfully.");
        navigate("/shopowner-main-page");
      })
      .catch((err) => {
        alert("Failed to delete shop.");
      });
  };

  return (
    <div>
      <Header />
      <div className="shop-detail-container">
        <h2 className="title">Shop Details</h2>

        {shop ? (
          <TableContainer component={Paper} className="detail-table">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="label-cell">Name</TableCell>
                  <TableCell className="value-cell">{shop.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="label-cell">Country</TableCell>
                  <TableCell className="value-cell">{shop.country}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="label-cell">City</TableCell>
                  <TableCell className="value-cell">{shop.city}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="label-cell">Address</TableCell>
                  <TableCell className="value-cell">{shop.address}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="label-cell">
                    Address Description
                  </TableCell>
                  <TableCell className="value-cell">
                    {shop.addressDescription}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="label-cell">Capacity</TableCell>
                  <TableCell className="value-cell">{shop.capacity}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="label-cell">Opening Hour</TableCell>
                  <TableCell className="value-cell">
                    {shop.openingHour.slice(0, 5)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="label-cell">Closing Hour</TableCell>
                  <TableCell className="value-cell">
                    {shop.closingHour.slice(0, 5)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="label-cell">Status</TableCell>
                  <TableCell
                    className="value-cell"
                    style={statusStyle(shop.status)}
                  >
                    {shop.status}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <button className="delete-button" onClick={handleDelete}>
              Delete Shop
            </button>
          </TableContainer>
        ) : (
          <span className="no-data">
            <div className="no-data-div">
              <h2>There is no data about this shop.</h2>
            </div>
          </span>
        )}
      </div>
    </div>
  );
};

export default ShopDetailPage;
