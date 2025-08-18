// HomePage.js (Updated with imports for Header and Footer)
import React from "react";
import { Container, Row, Col, Button, Form, Card, Badge } from "react-bootstrap";
import { FaSearch, FaHeart, FaBed, FaBath, FaCar, FaBuilding, FaWarehouse, FaHome, FaMotorcycle } from "react-icons/fa";
import { GiOfficeChair, GiFarmTractor } from "react-icons/gi";
import { Link } from "react-router-dom";
// import Header from "./Header"; // Import the new Header component
// import Footer from "./Footer"; // Import the new Footer component

export default function HomePage() {
  // Sample data for different categories
  const properties = [
    { id: 1, title: "Luxury Penthouse", price: "$1,200,000", location: "New York", type: "apartment", beds: 3, baths: 2, image: "https://images.unsplash.com/photo-1560185008-5bf9d6fc48f3?auto=format&fit=crop&w=800&q=80" },
    { id: 2, title: "Modern Office Space", price: "$750,000", location: "Chicago", type: "office", size: "2,500 sqft", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80" },
    { id: 3, title: "Classic Harley Davidson", price: "$18,500", location: "Miami", type: "motorcycle", year: 2019, image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80" },
    { id: 4, title: "Tesla Model S", price: "$85,000", location: "Los Angeles", type: "car", year: 2022, image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80" },
    { id: 5, title: "Suburban House", price: "$450,000", location: "Austin", type: "house", beds: 4, baths: 3, image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80" },
    { id: 6, title: "Industrial Excavator", price: "$120,000", location: "Houston", type: "machine", hours: 1200, image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80" },
    { id: 7, title: "10 Acre Land", price: "$350,000", location: "Denver", type: "land", zoning: "Residential", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80" },
    { id: 8, title: "Downtown Apartment", price: "$650,000", location: "Seattle", type: "apartment", beds: 2, baths: 2, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" },
  ];

  const categories = [
    { name: "All", icon: <FaSearch /> },
    { name: "House", icon: <FaHome /> },
    { name: "Apartment", icon: <FaBuilding /> },
    { name: "Office", icon: <GiOfficeChair /> },
    { name: "Land", icon: <FaWarehouse /> },
    { name: "Car", icon: <FaCar /> },
    { name: "Motorcycle", icon: <FaMotorcycle /> },
    { name: "Machine", icon: <GiFarmTractor /> },
  ];

  return (
    <div className="home-page">
      

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content text-white text-center">
          <h3 className="mb-3">Find Your Perfect Property or Vehicle</h3>
          <h1 className="display-4 mb-4">
            Discover <span className="text-success">Quality</span> Listings
          </h1>
          <Link to="/login">
            <Button variant="success" size="lg" className="px-5">Browse All</Button>
          </Link>
        </div>
      </div>

      {/* Search Filters */}
      <Container className="search-container shadow p-4 bg-white mt-n5 rounded">
        <Row className="g-2 align-items-center">
          <Col md={2}>
            <Form.Select className="form-select-custom">
              <option>All Categories</option>
              {categories.slice(1).map((cat, i) => (
                <option key={i}>{cat.name}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select className="form-select-custom">
              <option>Any Location</option>
              <option>New York</option>
              <option>California</option>
              <option>Texas</option>
              <option>Florida</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select className="form-select-custom">
              <option>Any Status</option>
              <option>For Sale</option>
              <option>For Rent</option>
              <option>For Lease</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Control type="number" placeholder="Min Price" className="form-input-custom" />
          </Col>
          <Col md={2}>
            <Form.Control type="number" placeholder="Max Price" className="form-input-custom" />
          </Col>
          <Col md={2}>
            <Button variant="success" className="w-100 search-btn">
              <FaSearch className="me-2" /> Search
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Categories Section */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Browse By Category</h2>
        <Row className="g-3 justify-content-center">
          {categories.map((category, index) => (
            <Col xs={6} sm={4} md={3} lg={2} key={index}>
              <Button variant="outline-success" className="category-btn w-100 py-3">
                <div className="category-icon mb-2">{category.icon}</div>
                {category.name}
              </Button>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Featured Listings */}
      <Container className="my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title">Featured Listings</h2>
          <Button variant="outline-success">View All</Button>
        </div>
        <Row className="g-4">
          {properties.map((property) => (
            <Col key={property.id} xs={12} sm={6} lg={4} xl={3}>
              <Card className="listing-card h-100">
                <div className="card-img-container">
                  <Card.Img variant="top" src={property.image} />
                  <Badge bg="success" className="property-type-badge">
                    {property.type}
                  </Badge>
                  <Button variant="light" className="wishlist-btn">
                    <FaHeart />
                  </Button>
                </div>
                <Card.Body>
                  <Card.Title>{property.title}</Card.Title>
                  <Card.Text className="text-muted">
                    <small>{property.location}</small>
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="price mb-0">{property.price}</h5>
                    <div className="features">
                      {property.beds && (
                        <span className="me-2">
                          <FaBed className="me-1" /> {property.beds}
                        </span>
                      )}
                      {property.baths && (
                        <span className="me-2">
                          <FaBath className="me-1" /> {property.baths}
                        </span>
                      )}
                      {property.year && (
                        <span>
                          <FaCar className="me-1" /> {property.year}
                        </span>
                      )}
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                  <Button variant="success" className="w-100">
                    View Details
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Call to Action */}
      <div className="cta-section py-5 bg-success text-white">
        <Container className="text-center">
          <h2 className="mb-4">Ready to Find Your Dream Property or Vehicle?</h2>
          <p className="lead mb-4">Join thousands of satisfied customers who found exactly what they were looking for.</p>
          <Button variant="light" size="lg" className="px-5 me-3">
            Browse Listings
          </Button>
          <Button variant="outline-light" size="lg" className="px-5">
            Sell Your Item
          </Button>
        </Container>
      </div>


      {/* Custom CSS */}
      <style jsx>{`
        .home-page {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .top-bar {
          font-size: 0.9rem;
        }
        .social-icons {
          font-size: 1rem;
        }
        .brand-text {
          font-weight: 700;
          font-size: 1.2rem;
          color: #333;
        }
        .nav-link-btn {
          border: none;
          background: none;
          color: #333;
          padding: 0.5rem 1rem;
        }
        .nav-link-btn:hover {
          color: #28a745;
        }
        .hero-section {
          background-image: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80');
          background-size: cover;
          background-position: center;
          height: 80vh;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
        }
        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          padding: 0 20px;
        }
        .search-container {
          z-index: 10;
          position: relative;
        }
        .form-select-custom, .form-input-custom {
          height: 45px;
          border-radius: 4px;
        }
        .search-btn {
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .category-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .category-btn:hover {
          background-color: #28a745;
          color: white;
        }
        .category-icon {
          font-size: 1.5rem;
        }
        .section-title {
          position: relative;
          display: inline-block;
        }
        .section-title:after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 50px;
          height: 3px;
          background-color: #28a745;
        }
        .listing-card {
          border-radius: 10px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: none;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .listing-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        .card-img-container {
          position: relative;
          overflow: hidden;
          height: 200px;
        }
        .card-img-container img {
          object-fit: cover;
          width: 100%;
          height: 100%;
          transition: transform 0.5s ease;
        }
        .listing-card:hover .card-img-container img {
          transform: scale(1.05);
        }
        .property-type-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          text-transform: capitalize;
        }
        .wishlist-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dc3545;
        }
        .price {
          color: #28a745;
          font-weight: 700;
        }
        .features {
          font-size: 0.9rem;
          color: #6c757d;
        }
        .cta-section {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        }
        footer {
          background-color: #343a40;
        }
        footer h5 {
          color: #fff;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }
        footer ul li {
          margin-bottom: 0.5rem;
          color: #adb5bd;
          cursor: pointer;
          transition: color 0.3s ease;
        }
        footer ul li:hover {
          color: #28a745;
        }
        footer address {
          color: #adb5bd;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}