import React, { useEffect, useState } from "react";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Spinner, 
  Alert, 
  Button, 
  Badge,
  Carousel,
  Modal,
  Image
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FiArrowLeft, 
  FiMapPin, 
  FiCalendar, 
  FiDollarSign, 
  FiStar, 
  FiPhone, 
  FiCreditCard, 
  FiMessageSquare,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

function ListingDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        const id = slug.split("--").pop(); // Extract ID from slug

        const response = await axios.get(`http://127.0.0.1:8000/api/listings/${id}/`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });

        const data = response.data;
        
        // Process images to ensure they have full URLs
        const processedImages = data.images?.map(img => ({
          ...img,
          full_url: img.image.startsWith('http') ? img.image : `http://127.0.0.1:8000${img.image}`
        })) || [];

        setListing({
          ...data,
          images: processedImages,
          main_image: processedImages.length > 0 
            ? processedImages[0].full_url 
            : "https://via.placeholder.com/800x500?text=No+Image"
        });

      } catch (err) {
        setError("Failed to load listing details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [slug]);

  const handleChatClick = () => {
    navigate(`/chat/${listing.owner.id}`);
  };

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex(prev => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (error) return <Alert variant="danger" className="text-center mt-3">{error}</Alert>;
  if (!listing) return <Alert variant="warning" className="text-center mt-3">Listing not found.</Alert>;

  const { owner, images = [] } = listing;

  return (
    <Container className="listing-details-container py-4">
      <Button 
        variant="outline-primary" 
        className="mb-4" 
        onClick={() => navigate(-1)}
      >
        <FiArrowLeft className="me-2" /> Back
      </Button>

      <Row>
        {/* Main Content Column */}
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            {/* Image Gallery */}
            {images.length > 0 ? (
              <>
                <div className="main-image-container">
                  <Image
                    src={listing.main_image}
                    alt={listing.title}
                    fluid
                    className="main-image cursor-pointer"
                    onClick={() => openImageModal(0)}
                  />
                </div>
                
                {images.length > 1 && (
                  <div className="thumbnail-container px-3 pb-3">
                    <Row className="g-2">
                      {images.slice(0, 4).map((img, index) => (
                        <Col xs={6} sm={3} key={img.id}>
                          <Image
                            src={img.full_url}
                            alt={`${listing.title} - ${index + 1}`}
                            thumbnail
                            className={`thumbnail-image cursor-pointer ${index === 0 ? 'active' : ''}`}
                            onClick={() => openImageModal(index)}
                          />
                        </Col>
                      ))}
                      {images.length > 4 && (
                        <Col xs={6} sm={3}>
                          <div 
                            className="thumbnail-more d-flex justify-content-center align-items-center"
                            onClick={() => openImageModal(0)}
                          >
                            +{images.length - 4} more
                          </div>
                        </Col>
                      )}
                    </Row>
                  </div>
                )}
              </>
            ) : (
              <Image
                src="https://via.placeholder.com/800x500?text=No+Image"
                alt="No image available"
                fluid
                className="main-image"
              />
            )}

            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2 className="mb-1">{listing.title}</h2>
                  <Badge
                    bg={
                      listing.availability_status === "Available"
                        ? "success"
                        : listing.availability_status === "Pending"
                        ? "warning"
                        : "danger"
                    }
                    className="mb-2"
                  >
                    {listing.availability_status}
                  </Badge>
                  <p className="text-muted mb-2">{listing.category}</p>
                </div>
                <h3 className="text-success mb-0">
                  <FiDollarSign className="me-1" />
                  {listing.price?.toLocaleString()}
                </h3>
              </div>

              <div className="listing-meta mb-4">
                <div className="d-flex flex-wrap gap-3">
                  <span className="d-flex align-items-center">
                    <FiMapPin className="me-1" />
                    {listing.location}
                  </span>
                  <span className="d-flex align-items-center">
                    <FiCalendar className="me-1" />
                    {new Date(listing.created_at).toLocaleDateString()}
                  </span>
                  <span className="d-flex align-items-center">
                    <FiStar className="me-1 text-warning" />
                    {listing.rating || "New"}
                  </span>
                </div>
              </div>

              <div className="listing-description">
                <h5 className="mb-3">Description</h5>
                <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                  {listing.description || "No description provided."}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar Column */}
        <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-3">Owner Information</h5>
              
              <div className="d-flex align-items-center mb-3">
                <Image
                  src={owner.profile_picture || "https://via.placeholder.com/50"}
                  roundedCircle
                  width={50}
                  height={50}
                  className="me-3"
                />
                <div>
                  <h6 className="mb-0">{owner.full_name || owner.username}</h6>
                  <small className="text-muted">
                    {owner.is_verified ? "Verified Seller" : "Unverified Seller"}
                  </small>
                </div>
              </div>

              <ul className="list-unstyled">
                <li className="mb-2">
                  <strong>Email:</strong> {owner.email}
                </li>
                {owner.phone_number && (
                  <li className="mb-2">
                    <FiPhone className="me-1" />
                    <strong>Phone:</strong> {owner.phone_number}
                  </li>
                )}
                {owner.nida && (
                  <li className="mb-2">
                    <FiCreditCard className="me-1" />
                    <strong>NIDA:</strong> {owner.nida}
                  </li>
                )}
                <li className="mb-2">
                  <strong>Member since:</strong> {new Date(owner.date_joined).toLocaleDateString()}
                </li>
              </ul>

              <Button 
                variant="primary" 
                className="w-100 mt-3" 
                onClick={handleChatClick}
              >
                <FiMessageSquare className="me-2" /> Chat with Owner
              </Button>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Safety Tips</h5>
              <ul className="small text-muted">
                <li className="mb-2">Meet in a public place</li>
                <li className="mb-2">Inspect the item before purchasing</li>
                <li className="mb-2">Never pay in advance</li>
                <li className="mb-2">Avoid deals that seem too good to be true</li>
                <li>Report suspicious activity to us</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Image Modal */}
      <Modal 
        show={showImageModal} 
        onHide={() => setShowImageModal(false)}
        centered
        size="lg"
      >
        <Modal.Body className="p-0">
          {images.length > 0 && (
            <div className="image-modal-content">
              <Image
                src={images[selectedImageIndex].full_url}
                alt={`${listing.title} - ${selectedImageIndex + 1}`}
                fluid
                className="modal-main-image"
              />
              
              {images.length > 1 && (
                <>
                  <Button 
                    variant="light" 
                    className="modal-nav-btn prev-btn rounded-circle"
                    onClick={handlePrevImage}
                  >
                    <FiChevronLeft size={24} />
                  </Button>
                  <Button 
                    variant="light" 
                    className="modal-nav-btn next-btn rounded-circle"
                    onClick={handleNextImage}
                  >
                    <FiChevronRight size={24} />
                  </Button>
                </>
              )}
              
              <div className="image-counter">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Custom CSS */}
      <style jsx>{`
        .listing-details-container {
          max-width: 1200px;
        }
        .main-image-container {
          position: relative;
          overflow: hidden;
          background-color: #f8f9fa;
        }
        .main-image {
          width: 100%;
          height: 400px;
          object-fit: contain;
          background-color: white;
          padding: 1rem;
        }
        .thumbnail-container {
          background-color: #f8f9fa;
        }
        .thumbnail-image {
          width: 100%;
          height: 100px;
          object-fit: cover;
          transition: all 0.3s ease;
        }
        .thumbnail-image:hover, .thumbnail-image.active {
          border-color: #0d6efd;
          transform: scale(1.02);
        }
        .thumbnail-more {
          height: 100px;
          background-color: #e9ecef;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .thumbnail-more:hover {
          background-color: #dee2e6;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .image-modal-content {
          position: relative;
        }
        .modal-main-image {
          width: 100%;
          max-height: 70vh;
          object-fit: contain;
        }
        .modal-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          opacity: 0.8;
        }
        .modal-nav-btn:hover {
          opacity: 1;
        }
        .prev-btn {
          left: 15px;
        }
        .next-btn {
          right: 15px;
        }
        .image-counter {
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0,0,0,0.5);
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.9rem;
        }
      `}</style>
    </Container>
  );
}

export default ListingDetails;