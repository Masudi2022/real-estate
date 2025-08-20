import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Modal, Badge, Spinner, Alert, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaHome, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaCar, 
  FaMotorcycle, 
  FaTruck,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaChartLine,
  FaSearchDollar
} from "react-icons/fa";

export default function SellerDashboard() {
  const [listings, setListings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentListingId, setCurrentListingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "House",
    price: "",
    location: "",
    availability_status: "Available",
    bedrooms: "",
    bathrooms: "",
    area: ""
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const API_URL = "http://127.0.0.1:8000/api/";

  // Fetch seller's listings
  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}seller-listings/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListings(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch listings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Filter listings based on search and status
  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || listing.availability_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Form input handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      setError("You can upload a maximum of 10 images");
      return;
    }
    setImages(files);
  };

  // Open modal for editing
  const handleEdit = (e, listing) => {
    e.stopPropagation();
    setFormData({
      title: listing.title,
      description: listing.description,
      category: listing.category,
      price: listing.price,
      location: listing.location,
      availability_status: listing.availability_status,
      bedrooms: listing.bedrooms || "",
      bathrooms: listing.bathrooms || "",
      area: listing.area || ""
    });
    setImages([]);
    setCurrentListingId(listing.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // Delete listing
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await axios.delete(`${API_URL}listings/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchListings();
    } catch (err) {
      console.error(err);
      setError("Failed to delete listing. Please try again.");
    }
  };

  // Create or update listing
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      images.forEach((file) => data.append("images", file));

      if (isEditing) {
        await axios.put(`${API_URL}seller-listings/${currentListingId}/`, data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
        });
      } else {
        await axios.post(`${API_URL}seller-listings/`, data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
        });
      }
      setShowModal(false);
      setIsEditing(false);
      setCurrentListingId(null);
      setFormData({
        title: "",
        description: "",
        category: "House",
        price: "",
        location: "",
        availability_status: "Available",
        bedrooms: "",
        bathrooms: "",
        area: ""
      });
      setImages([]);
      fetchListings();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to save listing. Please check your input and try again.");
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case "House": return <FaHome className="me-2" />;
      case "Apartment": return <FaBuilding className="me-2" />;
      case "Land": return <FaMapMarkerAlt className="me-2" />;
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

  return (
    <Container fluid className="px-4 py-4">
      {/* Dashboard Header */}
      <div className="dashboard-header mb-4 p-4 bg-white rounded-3 shadow-sm">
        <Row className="align-items-center">
          <Col md={6}>
            <h2 className="fw-bold mb-1">
              <FaHome className="me-2 text-primary" />
              My Listings
            </h2>
            <p className="text-muted mb-0">Manage your property portfolio</p>
          </Col>
          <Col md={6} className="text-md-end mt-3 mt-md-0">
            <Button 
              variant="primary" 
              onClick={() => { 
                setShowModal(true); 
                setIsEditing(false); 
                setCurrentListingId(null); 
              }}
              className="px-4 py-2"
            >
              <FaPlus className="me-2" />
              Add New Property
            </Button>
            <Button
  variant="secondary" 
  onClick={() => navigate("/bookings")}
  className="px-4 py-2 ms-2"
>
  <FaSearchDollar className="me-2" />
  View All Bookings
</Button>
            </Col>
        </Row>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                <FaHome className="text-primary fs-4" />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Listings</h6>
                <h3 className="mb-0">{listings.length}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                <FaSearchDollar className="text-success fs-4" />
              </div>
              <div>
                <h6 className="text-muted mb-1">Available</h6>
                <h3 className="mb-0">
                  {listings.filter(l => l.availability_status === "Available").length}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-info bg-opacity-10 p-3 rounded-circle me-3">
                <FaChartLine className="text-info fs-4" />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Value</h6>
                <h3 className="mb-0">
                  TZS {listings.reduce((sum, listing) => sum + (parseFloat(listing.price) || 0), 0).toLocaleString()}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Search Properties</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    placeholder="Search by title or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Status</Form.Label>
                <Form.Select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Rented">Rented</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("All");
                }}
                className="w-100"
              >
                Clear Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" size="lg" />
          <h5 className="mt-3">Loading your properties...</h5>
        </div>
      ) : filteredListings.length === 0 ? (
        <Card className="text-center p-5 border-0 shadow-sm">
          <Card.Body>
            <Image 
              src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" 
              width={120}
              className="mb-4 opacity-75"
            />
            <h4 className="text-muted mb-3">
              {searchTerm || filterStatus !== "All" ? 
                "No matching properties found" : 
                "You don't have any listings yet"}
            </h4>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              className="px-4 py-2"
            >
              <FaPlus className="me-2" />
              Add Your First Property
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredListings.map(listing => (
            <Col key={listing.id}>
              <Card 
                className="h-100 border-0 shadow-sm hover-shadow-lg transition-all"
                onClick={() => navigate(`/listing/${encodeURIComponent(listing.title)}`)}
              >
                {listing.images && listing.images.length > 0 ? (
                  <div className="property-image-container">
                    <Card.Img 
                      variant="top" 
                      src={listing.images[0].image} 
                      alt={listing.title}
                      className="property-image"
                    />
                    <Badge 
                      bg={getStatusVariant(listing.availability_status)}
                      className="position-absolute top-2 end-2"
                    >
                      {listing.availability_status}
                    </Badge>
                  </div>
                ) : (
                  <div className="property-image-placeholder bg-light d-flex align-items-center justify-content-center">
                    <div className="text-muted">No Images Available</div>
                  </div>
                )}
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0">{listing.title}</Card.Title>
                    <div className="text-primary fw-bold">
                      TZS {parseInt(listing.price).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center text-muted mb-3">
                    {getCategoryIcon(listing.category)}
                    <small>{listing.category}</small>
                    <span className="mx-2">•</span>
                    <FaMapMarkerAlt className="me-1" />
                    <small>{listing.location}</small>
                  </div>

                  <div className="d-flex flex-wrap gap-3 mb-3">
                    {listing.bedrooms && (
                      <div className="d-flex align-items-center">
                        <FaBed className="text-muted me-2" />
                        <small>{listing.bedrooms} beds</small>
                      </div>
                    )}
                    {listing.bathrooms && (
                      <div className="d-flex align-items-center">
                        <FaBath className="text-muted me-2" />
                        <small>{listing.bathrooms} baths</small>
                      </div>
                    )}
                    {listing.area && (
                      <div className="d-flex align-items-center">
                        <FaRulerCombined className="text-muted me-2" />
                        <small>{listing.area} sqft</small>
                      </div>
                    )}
                  </div>

                  <Card.Text className="text-muted mb-3 line-clamp-2">
                    {listing.description}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-transparent border-top-0 pt-0">
                  <div className="d-flex justify-content-end gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={(e) => handleEdit(e, listing)}
                      className="d-flex align-items-center"
                    >
                      <FaEdit className="me-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={(e) => handleDelete(e, listing.id)}
                      className="d-flex align-items-center"
                    >
                      <FaTrash className="me-1" /> Delete
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            {isEditing ? "Edit Property Listing" : "Create New Property Listing"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Property Title</Form.Label>
                  <Form.Control 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                    placeholder="E.g. Luxury waterfront villa with pool"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Property Type</Form.Label>
                  <Form.Select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                  >
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Land">Land</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Car">Car</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Truck">Truck</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Description</Form.Label>
              <Form.Control
                name="description"
                value={formData.description}
                onChange={handleChange}
                as="textarea"
                rows={4}
                required
                placeholder="Describe the property features, amenities, and unique selling points..."
              />
            </Form.Group>

            <Row className="g-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Price (TZS)</Form.Label>
                  <Form.Control 
                    name="price" 
                    type="number" 
                    value={formData.price} 
                    onChange={handleChange} 
                    required 
                    placeholder="500,000"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Bedrooms</Form.Label>
                  <Form.Control 
                    name="bedrooms" 
                    type="number" 
                    value={formData.bedrooms} 
                    onChange={handleChange} 
                    placeholder="3"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Bathrooms</Form.Label>
                  <Form.Control 
                    name="bathrooms" 
                    type="number" 
                    value={formData.bathrooms} 
                    onChange={handleChange} 
                    placeholder="2"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Location</Form.Label>
                  <Form.Control 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    required 
                    placeholder="Full address or neighborhood"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Area (sqft)</Form.Label>
                  <Form.Control 
                    name="area" 
                    type="number" 
                    value={formData.area} 
                    onChange={handleChange} 
                    placeholder="1800"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Status</Form.Label>
                  <Form.Select 
                    name="availability_status" 
                    value={formData.availability_status} 
                    onChange={handleChange}
                  >
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Rented">Rented</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">
                Property Images <small className="text-muted">(Max 10 images)</small>
              </Form.Label>
              <Form.Control 
                type="file" 
                multiple 
                onChange={handleImageChange} 
                accept="image/*"
              />
              <Form.Text className="text-muted">
                Upload high-quality images (JPEG, PNG). First image will be featured.
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-3 pt-2">
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowModal(false)}
                className="px-4"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                className="px-4"
              >
                {isEditing ? "Save Changes" : "Create Listing"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .property-image-container {
          position: relative;
          padding-top: 60%;
          overflow: hidden;
        }
        .property-image, .property-image-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .property-image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hover-shadow-lg:hover {
          box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
          transform: translateY(-2px);
        }
        .transition-all {
          transition: all 0.3s ease;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .border-dashed {
          border: 2px dashed #dee2e6;
        }
      `}</style>
    </Container>
  );
}