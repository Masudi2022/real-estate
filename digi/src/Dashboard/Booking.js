import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Modal,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiCalendar, FiCheckCircle } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [user, setUser] = useState(null); // Store authenticated user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bookingType, setBookingType] = useState("BUYING");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Fetch listing details and user details
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching listing with ID:", id);
        if (!id) {
          throw new Error("No listing ID provided in the URL");
        }

        const access_token = localStorage.getItem("access_token");
        if (!access_token) {
          throw new Error("No access token found. Please log in.");
        }

        // Fetch listing
        const listingResponse = await axios.get(
          `http://127.0.0.1:8000/api/listings/${id}/`,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );
        console.log("Listing API response:", listingResponse.data);
        setListing(listingResponse.data);

        // Fetch authenticated user
        const userResponse = await axios.get(
          `http://127.0.0.1:8000/api/user/me/`,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );
        console.log("User API response:", userResponse.data);
        if (userResponse.data.role !== "Buyer") {
          throw new Error("Only users with Buyer role can create bookings.");
        }
        setUser(userResponse.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err.message === "No listing ID provided in the URL"
            ? "No listing ID provided in the URL"
            : err.message === "No access token found. Please log in."
            ? "Please log in to view listing details"
            : err.message === "Only users with Buyer role can create bookings."
            ? "Only users with Buyer role can create bookings"
            : err.response?.status === 404
            ? `Listing with ID ${id} not found`
            : "Failed to load listing or user details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate rental dates if booking type is RENTAL
    if (bookingType === "RENTAL" && (!startDate || !endDate)) {
      setError("Please select both start and end dates for rental");
      return;
    }

    if (bookingType === "RENTAL" && startDate >= endDate) {
      setError("End date must be after start date");
      return;
    }

    if (!user) {
      setError("User information not loaded. Please log in again.");
      return;
    }

    try {
      const access_token = localStorage.getItem("access_token");
      const bookingData = {
        listing: listing.id,
        buyer: user.id,
        booking_type: bookingType,
        ...(bookingType === "RENTAL" && {
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
        }),
      };

      console.log("Sending booking data:", bookingData);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/bookings/",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Booking API response:", response.data);
      setShowConfirmation(true);
    } catch (err) {
      console.error("Booking error:", err);
      setError(
        err.response?.data?.detail ||
        err.response?.data?.buyer ||
        err.response?.data?.listing ||
        err.response?.data?.dates ||
        "Failed to create booking. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  if (!listing || !user) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Listing or user not found</Alert>
        <Button variant="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Button
        variant="outline-primary"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        Back to Listing
      </Button>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Book {listing.title}</h4>
            </Card.Header>
            <Card.Body>
              <Tabs
                activeKey={bookingType}
                onSelect={(k) => setBookingType(k)}
                className="mb-4"
              >
                <Tab eventKey="BUYING" title="Buy Property">
                  <div className="mt-3">
                    <h5>
                      Purchase Details
                    </h5>
                    <p className="text-muted">
                      You are requesting to purchase this property for{" "}
                      <strong>TZS {listing.price.toLocaleString()}</strong>.
                    </p>
                  </div>
                </Tab>
                <Tab eventKey="RENTAL" title="Rent Property">
                  <div className="mt-3">
                    <h5>
                      <FiCalendar className="me-2" />
                      Rental Period
                    </h5>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Start Date</Form.Label>
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            minDate={new Date()}
                            className="form-control"
                            placeholderText="Select start date"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>End Date</Form.Label>
                          <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            minDate={startDate || new Date()}
                            className="form-control"
                            placeholderText="Select end date"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </Tab>
              </Tabs>

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">
                    Total: TZS {listing.price.toLocaleString()}
                  </h5>
                  {bookingType === "RENTAL" && (
                    <small className="text-muted">
                      (Price for selected rental period)
                    </small>
                  )}
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={bookingType === "RENTAL" && (!startDate || !endDate)}
                >
                  Confirm Booking
                </Button>
              </div>

              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmation}
        onHide={() => {
          setShowConfirmation(false);
          navigate(`/listings/${listing.id}`);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Booking Confirmed!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <FiCheckCircle size={48} className="text-success mb-3" />
            <h4>Your booking has been submitted successfully</h4>
            <p className="text-muted">
              {bookingType === "RENTAL"
                ? `Your rental request for ${listing.title} from ${startDate?.toLocaleDateString()} to ${endDate?.toLocaleDateString()} has been received.`
                : `Your purchase request for ${listing.title} has been received.`}
            </p>
            <p>The owner will contact you shortly to confirm details.</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowConfirmation(false);
              navigate(`/listings/${listing.id}`);
            }}
          >
            Return to Listing
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Booking;