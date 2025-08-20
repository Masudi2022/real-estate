import React, { useEffect, useState } from "react";
import { 
  Button, 
  Container, 
  Row, 
  Col, 
  Card, 
  Spinner, 
  Alert, 
  Badge,
  Dropdown,
  Tab,
  Tabs,
  Image,
  Stack,
  ProgressBar,
  Modal,
  Carousel
} from "react-bootstrap";
import { 
  useNavigate,
  Link,
  useLocation
} from "react-router-dom";
import axios from "axios";
import { 
  FiLogOut, 
  FiPlusCircle, 
  FiEdit, 
  FiTrash2, 
  FiEye,
  FiDollarSign,
  FiMapPin,
  FiCalendar,
  FiStar,
  FiUser,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";
import { 
  FaRegHeart, 
  FaHeart,
  FaShareAlt,
  FaRegComment
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Show success message if redirected from successful listing creation
  const [showSuccessAlert, setShowSuccessAlert] = useState(
    location.state?.fromCreateListing || false
  );

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        const response = await axios.get("http://127.0.0.1:8000/api/listings/", {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        
        // Process listings to include proper image URLs
        const processedListings = response.data.map(listing => {
          // Use the first image if available, or fallback
          const mainImage = listing.images?.length > 0 
            ? listing.images[0].image.startsWith('http') 
              ? listing.images[0].image 
              : `http://127.0.0.1:8000${listing.images[0].image}`
            : "https://via.placeholder.com/600x400?text=No+Image";
            
          return {
            ...listing,
            mainImage,
            images: listing.images?.map(img => ({
              ...img,
              fullUrl: img.image.startsWith('http') ? img.image : `http://127.0.0.1:8000${img.image}`
            })) || []
          };
        });
        
        setListings(processedListings);
      } catch (err) {
        setError("Failed to fetch listings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const toggleFavorite = (listingId, e) => {
    e.stopPropagation();
    if (favorites.includes(listingId)) {
      setFavorites(favorites.filter(id => id !== listingId));
    } else {
      setFavorites([...favorites, listingId]);
    }
  };

  const getStatusBadge = (status) => {
    switch(status.toLowerCase()) {
      case 'available': return 'success';
      case 'pending': return 'warning';
      case 'sold': return 'danger';
      default: return 'secondary';
    }
  };

  const filteredListings = listings.filter(listing => {
    let statusMatch = true;
    if (activeTab === 'active') statusMatch = listing.availability_status === 'Available';
    if (activeTab === 'pending') statusMatch = listing.availability_status === 'Pending';
    if (activeTab === 'sold') statusMatch = listing.availability_status === 'Sold';
    
    const searchMatch = 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  const navigateToDetails = (listing) => {
    const slug = listing.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    navigate(`/listings/${slug}--${listing.id}`);
  };

  const openImageModal = (listing, index = 0) => {
    setSelectedListing(listing);
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex(prev => 
      prev === 0 ? selectedListing.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev => 
      prev === selectedListing.images.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading your listings...</p>
        </div>
      </div>
    );
  }

  return (
    <Container fluid className="dashboard-container px-lg-5">
      {/* Success Alert */}
      {showSuccessAlert && (
        <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
          Your listing has been created successfully!
        </Alert>
      )}

      {/* Dashboard Header */}
      <Row className="dashboard-header align-items-center py-4 mb-4">
        <Col md={6}>
          <h2 className="mb-0">Marketplace Dashboard</h2>
          <p className="text-muted mb-0">Browse and manage your listings</p>
        </Col>
        <Col md={6} className="text-md-end">
          <Stack direction="horizontal" gap={3} className="justify-content-md-end">
            <Button 
              variant="success" 
              as={Link} 
              to="/create-listing"
              className="d-flex align-items-center"
              state={{ fromDashboard: true }}
            >
              <FiPlusCircle className="me-2" /> Add New Listing
            </Button>
            <Button 
              variant="outline-danger" 
              onClick={handleLogout}
              className="d-flex align-items-center"
            >
              <FiLogOut className="me-2" /> Logout
            </Button>
          </Stack>
        </Col>
      </Row>

      {/* Search and Filter Bar */}
      <Card className="mb-4 shadow-sm">
        <Card.Body className="py-3">
          <Row className="align-items-center">
            <Col md={6}>
              <div className="search-bar">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search listings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    <FiEye />
                  </button>
                </div>
              </div>
            </Col>
            <Col md={6} className="text-md-end mt-3 mt-md-0">
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="sort-dropdown">
                  Sort By: Newest
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Newest First</Dropdown.Item>
                  <Dropdown.Item>Oldest First</Dropdown.Item>
                  <Dropdown.Item>Price: Low to High</Dropdown.Item>
                  <Dropdown.Item>Price: High to Low</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Stats Overview */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted mb-2">Total Listings</h6>
                  <h3 className="mb-0">{listings.length}</h3>
                </div>
                <div className="icon-circle bg-primary-light">
                  <FiEye className="text-primary" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted mb-2">Active Listings</h6>
                  <h3 className="mb-0">{listings.filter(l => l.availability_status === 'Available').length}</h3>
                </div>
                <div className="icon-circle bg-success-light">
                  <FiStar className="text-success" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted mb-2">Total Value</h6>
                  <h3 className="mb-0">TZS {listings.reduce((sum, listing) => sum + (parseFloat(listing.price) || 0), 0).toLocaleString()}</h3>
                </div>
                <div className="icon-circle bg-info-light">
                  <FiDollarSign className="text-info" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Listings Section */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
            <Tab eventKey="active" title={<><span>Active</span> <Badge bg="success" className="ms-2">{listings.filter(l => l.availability_status === 'Available').length}</Badge></>} />
            <Tab eventKey="pending" title={<><span>Pending</span> <Badge bg="warning" className="ms-2">{listings.filter(l => l.availability_status === 'Pending').length}</Badge></>} />
            <Tab eventKey="sold" title={<><span>Sold</span> <Badge bg="danger" className="ms-2">{listings.filter(l => l.availability_status === 'Sold').length}</Badge></>} />
            <Tab eventKey="all" title={<><span>All</span> <Badge bg="secondary" className="ms-2">{listings.length}</Badge></>} />
          </Tabs>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading your listings...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="text-center">{error}</Alert>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-5">
              <Image 
                src="https://cdn.dribbble.com/users/888330/screenshots/2653750/media/b7459526febf0fa3e4a6d4fc5e9b4e1e.png" 
                fluid 
                style={{ maxWidth: '300px' }}
                className="mb-3"
              />
              <h5>No listings found</h5>
              <p className="text-muted">
                {searchQuery ? "No listings match your search criteria" : `You don't have any ${activeTab} listings yet`}
              </p>
              <Button variant="primary" as={Link} to="/create-listing">
                Create your first listing
              </Button>
            </div>
          ) : (
            <Row>
              {filteredListings.map((listing) => (
                <Col xs={12} md={6} lg={4} className="mb-4" key={listing.id}>
                  <Card className="h-100 listing-card">
                    <div className="position-relative">
                      <Image
                        src={listing.mainImage}
                        alt={listing.title}
                        fluid
                        className="listing-main-image"
                        onClick={() => openImageModal(listing)}
                      />
                      <Badge bg={getStatusBadge(listing.availability_status)} className="position-absolute top-0 start-0 m-2">
                        {listing.availability_status}
                      </Badge>
                      <Button 
                        variant="link" 
                        className="position-absolute top-0 end-0 m-2 p-0"
                        onClick={(e) => toggleFavorite(listing.id, e)}
                      >
                        {favorites.includes(listing.id) ? (
                          <FaHeart className="text-danger" size={20} />
                        ) : (
                          <FaRegHeart className="text-white" size={20} />
                        )}
                      </Button>
                    </div>
                    
                    {/* Thumbnail Gallery */}
                    {listing.images.length > 1 && (
                      <div className="thumbnail-gallery px-3 pt-2">
                        <Row className="g-2">
                          {listing.images.slice(0, 4).map((img, index) => (
                            <Col xs={3} key={img.id}>
                              <Image
                                src={img.fullUrl}
                                alt={`${listing.title} - ${index + 1}`}
                                thumbnail
                                className="thumbnail-image"
                                onClick={() => openImageModal(listing, index)}
                              />
                            </Col>
                          ))}
                          {listing.images.length > 4 && (
                            <Col xs={3}>
                              <div 
                                className="thumbnail-more d-flex justify-content-center align-items-center"
                                onClick={() => openImageModal(listing)}
                              >
                                +{listing.images.length - 4}
                              </div>
                            </Col>
                          )}
                        </Row>
                      </div>
                    )}
                    
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="mb-0 text-truncate">{listing.title}</Card.Title>
                        <h5 className="text-success mb-0">TZS {listing.price?.toLocaleString()}</h5>
                      </div>
                      <Card.Subtitle className="text-muted mb-2">
                        <FiMapPin className="me-1" /> {listing.location}
                      </Card.Subtitle>
                      
                      <Card.Text className="mb-3 text-truncate-2">
                        {listing.description}
                      </Card.Text>
                      
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <small className="text-muted">
                          <FiCalendar className="me-1" /> {new Date(listing.created_at).toLocaleDateString()}
                        </small>
                        <div className="d-flex align-items-center">
                          <FiStar className="text-warning me-1" />
                          <small>{listing.rating || 'New'}</small>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="w-100 me-3">
                          <ProgressBar 
                            now={listing.views || 0} 
                            label={`${listing.views || 0} views`} 
                            className="mb-2" 
                          />
                        </div>
                        <Button 
                          variant="primary" 
                          className="d-flex align-items-center"
                          onClick={() => navigateToDetails(listing)}
                        >
                          View <FiChevronRight className="ms-1" />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Image Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
        {selectedListing && selectedListing.images.length > 0 && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedListing.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
              <Carousel
                activeIndex={selectedImageIndex}
                onSelect={setSelectedImageIndex}
                interval={null}
                indicators={false}
                controls={selectedListing.images.length > 1}
                prevIcon={<FiChevronLeft size={32} className="text-dark" />}
                nextIcon={<FiChevronRight size={32} className="text-dark" />}
              >
                {selectedListing.images.map((img, index) => (
                  <Carousel.Item key={img.id}>
                    <div className="modal-image-container">
                      <Image
                        src={img.fullUrl}
                        alt={`${selectedListing.title} - ${index + 1}`}
                        fluid
                        className="modal-image"
                      />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Modal.Body>
            <Modal.Footer className="justify-content-between">
              <div>
                {selectedImageIndex + 1} of {selectedListing.images.length}
              </div>
              <Button variant="primary" onClick={() => navigateToDetails(selectedListing)}>
                View Listing Details
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Custom CSS */}
      <style jsx>{`
        .dashboard-container {
          max-width: 1600px;
          padding-top: 2rem;
        }
        .dashboard-header {
          border-bottom: 1px solid #eee;
        }
        .stat-card {
          border-radius: 10px;
          border: none;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        .icon-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }
        .bg-primary-light {
          background-color: rgba(13, 110, 253, 0.1);
        }
        .bg-success-light {
          background-color: rgba(25, 135, 84, 0.1);
        }
        .bg-warning-light {
          background-color: rgba(255, 193, 7, 0.1);
        }
        .bg-info-light {
          background-color: rgba(13, 202, 240, 0.1);
        }
        .listing-card {
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .listing-card:hover {
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          transform: translateY(-3px);
        }
        .listing-main-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        .listing-main-image:hover {
          transform: scale(1.02);
        }
        .thumbnail-gallery {
          background-color: #f8f9fa;
        }
        .thumbnail-image {
          width: 100%;
          height: 60px;
          object-fit: cover;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .thumbnail-image:hover {
          border-color: #0d6efd;
          transform: scale(1.05);
        }
        .thumbnail-more {
          height: 60px;
          background-color: #e9ecef;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.8rem;
        }
        .thumbnail-more:hover {
          background-color: #dee2e6;
        }
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .modal-image-container {
          position: relative;
          padding-top: 75%; /* 4:3 aspect ratio */
          background-color: #f8f9fa;
        }
        .modal-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .carousel-control-prev,
        .carousel-control-next {
          background-color: rgba(255,255,255,0.5);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
        }
      `}</style>
    </Container>
  );
}

export default Dashboard;