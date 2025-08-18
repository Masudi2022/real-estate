// Footer.js
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaLinkedin, FaGooglePlus, FaPhoneAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h5>About Vimboe Marketplace</h5>
            <p>Your one-stop destination for properties, vehicles, and equipment. We connect buyers and sellers with quality listings.</p>
            <div className="social-icons">
              <FaFacebook className="mx-2" />
              <FaTwitter className="mx-2" />
              <FaLinkedin className="mx-2" />
              <FaGooglePlus className="mx-2" />
            </div>
          </Col>
          <Col md={2} className="mb-4">
            <h5>Categories</h5>
            <ul className="list-unstyled">
              <li>Houses</li>
              <li>Apartments</li>
              <li>Offices</li>
              <li>Land</li>
              <li>Cars</li>
              <li>Motorcycles</li>
              <li>Machines</li>
            </ul>
          </Col>
          <Col md={3} className="mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>Home</li>
              <li>About Us</li>
              <li>Listings</li>
              <li>Blog</li>
              <li>Contact</li>
              <li>FAQ</li>
            </ul>
          </Col>
          <Col md={3} className="mb-4">
            <h5>Contact Us</h5>
            <address>
              <p>123 Market Street<br />New York, NY 10001</p>
              <p><FaPhoneAlt className="me-2" /> +1-234-567-8901</p>
              <p>info@vimboemarket.com</p>
            </address>
          </Col>
        </Row>
        <hr className="my-4" />
        <div className="text-center">
          <p className="mb-0">© 2025 Vimboe Marketplace | All Rights Reserved</p>
        </div>
      </Container>
    </footer>
  );
}