import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Container, Spinner, Alert, Button, Badge } from "react-bootstrap";
import { FiArrowLeft } from "react-icons/fi";

function PropertyBookings() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        const response = await axios.get(
          `http://127.0.0.1:8000/api/listings/${propertyId}/bookings/`,
          { headers: { Authorization: `Bearer ${access_token}` } }
        );
        console.log("Bookings response:", response.data);
        setBookings(response.data);
      } catch (err) {
        console.error("Error fetching bookings:", err.response?.data);
        setError("Failed to fetch bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [propertyId]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge bg="warning">{status}</Badge>;
      case "Confirmed":
        return <Badge bg="success">{status}</Badge>;
      case "Cancelled":
        return <Badge bg="danger">{status}</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) return <Alert variant="danger" className="text-center mt-3">{error}</Alert>;

  return (
    <Container className="py-4">
      <Button 
        variant="outline-primary" 
        className="mb-4" 
        onClick={() => navigate(-1)}
      >
        <FiArrowLeft className="me-2" /> Back
      </Button>

      <h2 className="mb-4">Bookings for Property #{propertyId}</h2>

      {bookings.length === 0 ? (
        <Alert variant="info">No bookings found for this property.</Alert>
      ) : (
        <Table bordered hover responsive className="shadow-sm">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Listing Title</th>
              <th>Buyer</th>
              <th>Status</th>
              <th>Booking Type</th>
              <th>Booking Date</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.listing_title}</td>
                <td>{booking.buyer_fullname}</td>
                <td>{getStatusBadge(booking.status)}</td>
                <td>{booking.booking_type}</td>
                <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                <td>{new Date(booking.created_at).toLocaleString()}</td>
                <td>{new Date(booking.updated_at).toLocaleString()}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      navigate("/chat", {
                        state: {
                          listingId: booking.listing,
                          bookingId: booking.id,
                          ownerId: booking.listing_owner,
                        },
                      })
                    }
                    disabled={!booking.listing_owner}
                  >
                    Chat with Owner
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default PropertyBookings;