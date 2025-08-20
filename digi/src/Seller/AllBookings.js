import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Spinner,
  Alert,
  Badge,
  Table,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaCalendarAlt, FaUser, FaHome } from "react-icons/fa";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const userId = parseInt(localStorage.getItem("user_id")); // Get logged-in user ID
  const API_URL = "http://127.0.0.1:8000/api/";

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}owner-bookings/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Bookings response:", res.data);
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err.response?.data);
      setError("Failed to fetch bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Confirmed":
        return "success";
      case "Cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getBookingTypeVariant = (type) => {
    return type === "BUYING" ? "info" : "primary";
  };

  const handleRowClick = (booking) => {
    setSelectedBooking(booking);
    setStatusUpdate(booking.status);
    setShowModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedBooking) return;
    try {
      await axios.patch(
        `${API_URL}bookings/${selectedBooking.id}/`,
        { status: statusUpdate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      fetchBookings(); // refresh
    } catch (err) {
      console.error("Error updating status:", err.response?.data);
      alert("Failed to update status. Try again.");
    }
  };

  const pendingCount = bookings.filter((b) => b.status === "Pending").length;

  return (
    <Container fluid className="px-4 py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">
          <FaHome className="me-2 text-primary" /> All Bookings
        </h3>
        <button
          className="btn btn-outline-secondary d-flex align-items-center"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="me-2" /> Back
        </button>
      </div>

      {/* Loading/Error */}
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <h5 className="mt-3">Loading bookings...</h5>
        </div>
      ) : bookings.length === 0 ? (
        <Card className="text-center p-5 border-0 shadow-sm">
          <Card.Body>
            <h4 className="text-muted">No bookings found</h4>
          </Card.Body>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Body>
            {/* Pending Alert */}
            {pendingCount > 0 && (
              <Alert variant="warning" className="fw-bold">
                You have {pendingCount} booking
                {pendingCount > 1 ? "s" : ""} pending and not yet processed.
              </Alert>
            )}

            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Property</th>
                  <th>Buyer</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Booking Date</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, index) => (
                  <tr
                    key={b.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(b)}
                  >
                    <td>{index + 1}</td>
                    <td>{b.listing_title}</td>
                    <td>
                      <FaUser className="me-1 text-muted" />
                      {b.buyer_fullname}
                    </td>
                    <td>
                      <Badge bg={getBookingTypeVariant(b.booking_type)}>
                        {b.booking_type}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(b.status)}>{b.status}</Badge>
                    </td>
                    <td>
                      <FaCalendarAlt className="me-1 text-muted" />
                      {b.booking_date}
                    </td>
                    <td>{new Date(b.created_at).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          navigate("/chat-seller", {
                            state: {
                              listingId: b.listing,
                              bookingId: b.id,
                              buyerId: b.buyer,
                            },
                          });
                        }}
                        disabled={!b.buyer || b.buyer === userId}
                      >
                        Chat with Customer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Status Update Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Booking Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <>
              <p>
                <strong>Property:</strong> {selectedBooking.listing_title}
              </p>
              <p>
                <strong>Buyer:</strong> {selectedBooking.buyer_fullname}
              </p>
              <Form>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={statusUpdate}
                    onChange={(e) => setStatusUpdate(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleStatusUpdate}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}