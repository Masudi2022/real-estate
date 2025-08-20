import React, { useEffect, useState } from "react";
import { Container, Card, Button, Form, Row, Col, Spinner, Alert, Badge, Image } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaUpload, FaHome, FaBuilding, FaMapMarkedAlt, FaCar, FaMotorcycle, FaTruck, FaCalendarAlt, FaSyncAlt } from "react-icons/fa";

export default function SellerListingDetails() {
  const { title } = useParams();
  const [listing, setListing] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const API_URL = "http://127.0.0.1:8000/api/";

  const fetchListing = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${API_URL}seller-listings/?title=${encodeURIComponent(title)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.length > 0) {
        setListing(res.data[0]);
      } else {
        setError("Listing not found");
        setTimeout(() => navigate(-1), 2000);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch listing details");
      setTimeout(() => navigate(-1), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError("You can upload a maximum of 5 images at once");
      return;
    }
    setSelectedFiles(files);
  };

  const handleSaveImages = async () => {
    if (!selectedFiles.length) {
      setError("Please select at least one image first");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      for (let file of selectedFiles) {
        const formData = new FormData();
        formData.append("listing", listing.id);
        formData.append("image", file);

        await axios.post(`${API_URL}listing-images/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setSuccess("Images uploaded successfully!");
      setSelectedFiles([]);
      fetchListing();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case "House": return <FaHome className="me-2" />;
      case "Apartment": return <FaBuilding className="me-2" />;
      case "Land": return <FaMapMarkedAlt className="me-2" />;
      case "Car": return <FaCar className="me-2" />;
      case "Motorcycle": return <FaMotorcycle className="me-2" />;
      case "Truck": return <FaTruck className="me-2" />;
      default: return <FaBuilding className="me-2" />;
    }
  };

  const getStatusVariant = (status) => {
    switch(status) {
      case "Available": return "success";
      case "Sold": return "danger";
      case "Rented": return "warning";
      default: return "secondary";
    }
  };

  useEffect(() => {
    fetchListing();
  }, [title]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Button
        variant="outline-secondary"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-2" />
        Back to Dashboard
      </Button>

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
          {success}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Row>
            <Col md={8}>
              <div className="d-flex align-items-center mb-3">
                <h2 className="mb-0 me-3">{listing.title}</h2>
                <Badge bg={getStatusVariant(listing.availability_status)} className="fs-6">
                  {listing.availability_status}
                </Badge>
              </div>

              <div className="d-flex align-items-center text-muted mb-4">
                {getCategoryIcon(listing.category)}
                <span className="me-3">{listing.category}</span>
                <FaMapMarkedAlt className="me-2" />
                <span>{listing.location}</span>
              </div>

              <div className="mb-4">
                <h4 className="text-primary">${listing.price}</h4>
              </div>

              <Card.Text className="mb-4">
                <h5 className="mb-3">Description</h5>
                <p className="text-muted">{listing.description}</p>
              </Card.Text>

              <div className="d-flex gap-3 text-muted mb-4">
                <div>
                  <h6 className="mb-1"><FaCalendarAlt className="me-2" />Created</h6>
                  <small>{new Date(listing.created_at).toLocaleString()}</small>
                </div>
                <div>
                  <h6 className="mb-1"><FaSyncAlt className="me-2" />Updated</h6>
                  <small>{new Date(listing.updated_at).toLocaleString()}</small>
                </div>
              </div>
            </Col>

            {listing.images && listing.images.length > 0 && (
              <Col md={4}>
                <h5 className="mb-3">Featured Image</h5>
                <Card className="mb-3 shadow-sm border-0">
                  <Card.Img
                    src={listing.images[0].image}
                    alt="Featured"
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                </Card>
              </Col>
            )}
          </Row>

          <hr className="my-4" />

          <div className="mb-4">
            <h5 className="mb-3">Upload New Images</h5>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Select images (max 5 at once)</Form.Label>
              <Form.Control 
                type="file" 
                multiple 
                onChange={handleFileChange} 
                accept="image/*"
                disabled={uploading}
              />
              <Form.Text className="text-muted">
                JPEG, PNG or GIF (Max 5MB each)
              </Form.Text>
            </Form.Group>

            {selectedFiles.length > 0 && (
              <div className="mb-4">
                <h6 className="mb-3">Selected Images Preview</h6>
                <div className="d-flex flex-wrap gap-3">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="position-relative">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        thumbnail
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                      <Badge 
                        bg="secondary" 
                        className="position-absolute top-0 start-100 translate-middle rounded-circle"
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                      >
                        ×
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              variant="primary" 
              onClick={handleSaveImages}
              disabled={uploading || !selectedFiles.length}
              className="d-flex align-items-center"
            >
              {uploading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload className="me-2" />
                  Upload Images
                </>
              )}
            </Button>
          </div>

          {listing.images && listing.images.length > 0 && (
            <div className="mt-5">
              <h5 className="mb-4">All Images ({listing.images.length})</h5>
              <Row xs={2} md={3} lg={4} className="g-4">
                {listing.images.map((img) => (
                  <Col key={img.id}>
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Img
                        variant="top"
                        src={img.image}
                        alt="Listing"
                        style={{ height: "180px", objectFit: "cover" }}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
