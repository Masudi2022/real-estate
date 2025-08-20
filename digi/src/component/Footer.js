// Footer.js
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-5">
      <Container>
        <Row>
          {/* About Section */}
          <Col md={4} className="mb-4">
            <h5>About Vimboe Marketplace</h5>
            <p>
              Vimboe is your trusted marketplace in Zanzibar and across Tanzania. 
              From houses and land to vehicles and equipment — we make buying and selling simple, fast, and reliable.
            </p>
            <div className="social-icons">
              <FaFacebook className="mx-2" />
              <FaTwitter className="mx-2" />
              <FaLinkedin className="mx-2" />
              <FaWhatsapp className="mx-2" />
            </div>
          </Col>

          {/* Categories */}
          <Col md={2} className="mb-4">
            <h5>Categories</h5>
            <ul className="list-unstyled">
              <li>Houses</li>
              <li>Apartments</li>
              <li>Plots & Land</li>
              <li>Cars</li>
              <li>Motorcycles</li>
              <li>Fishing Boats</li>
              <li>Machinery</li>
            </ul>
          </Col>

          {/* Quick Links */}
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

          {/* Contact */}
          <Col md={3} className="mb-4">
            <h5>Contact Us</h5>
            <address>
              <p>Stone Town, Zanzibar, Tanzania</p>
              <p><FaPhoneAlt className="me-2" /> +255 777 123 456</p>
              <p>support@vimboe.co.tz</p>
            </address>
          </Col>
        </Row>

        <hr className="my-4" />
        <div className="text-center">
          <p className="mb-0">© 2025 Vimboe Marketplace | Zanzibar, Tanzania</p>
        </div>
      </Container>
    </footer>
  );
}
