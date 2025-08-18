import React from "react";
import { 
  Container, 
  Navbar, 
  Nav, 
  Button, 
  Dropdown,
  Form,
  InputGroup
} from "react-bootstrap";
import { 
  FaPhoneAlt, 
  FaUser, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaGooglePlus,
  FaSearch,
  FaBell,
  FaEnvelope,
  FaShoppingCart
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

export default function Header() {
  return (
    <header className="sticky-top">
      {/* Top Bar */}
      <div className="top-bar bg-dark text-light py-2">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <span className="me-3"><FaPhoneAlt className="me-2" /> +1-234-567-8901</span>
              <span><MdLocationOn className="me-2" /> Nairobi, Kenya</span>
            </div>
            <div className="d-flex align-items-center">
              <Dropdown>
                <Dropdown.Toggle variant="dark" id="language-dropdown" size="sm">
                  English
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Swahili</Dropdown.Item>
                  <Dropdown.Item>French</Dropdown.Item>
                  <Dropdown.Item>Spanish</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <div className="social-icons ms-3">
                <a href="#" className="text-light mx-2"><FaFacebook /></a>
                <a href="#" className="text-light mx-2"><FaTwitter /></a>
                <a href="#" className="text-light mx-2"><FaLinkedin /></a>
                <a href="#" className="text-light mx-2"><FaGooglePlus /></a>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navigation */}
      <Navbar bg="white" expand="lg" className="py-3 shadow-sm">
        <Container>
          <Navbar.Brand href="#" className="d-flex align-items-center">
            <img 
              src="https://via.placeholder.com/150x50?text=DALALI" 
              alt="Dalali Logo" 
              className="me-2"
              style={{ height: '40px' }}
            />
          </Navbar.Brand>
          
          {/* Search Bar */}
          <div className="search-bar mx-4 flex-grow-1">
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search for properties, cars, items..."
                aria-label="Search"
                className="border-end-0"
              />
              <Button variant="outline-success" className="border-start-0">
                <FaSearch />
              </Button>
            </InputGroup>
          </div>

          {/* User Actions */}
          <div className="user-actions d-flex align-items-center">
            <Button variant="outline-secondary" className="me-2 position-relative">
              <FaBell />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </Button>
            <Button variant="outline-secondary" className="me-2 position-relative">
              <FaEnvelope />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                5
              </span>
            </Button>
            <Button variant="outline-secondary" className="me-3 position-relative">
              <FaShoppingCart />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                2
              </span>
            </Button>
            
            <Dropdown>
              <Dropdown.Toggle variant="success" id="user-dropdown">
                <FaUser className="me-2" /> My Account
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item>Profile</Dropdown.Item>
                <Dropdown.Item>Messages</Dropdown.Item>
                <Dropdown.Item>Orders</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </Container>
      </Navbar>

      {/* Secondary Navigation */}
      <Navbar bg="success" expand="lg" className="py-2">
        <Container>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#" className="text-white px-3">Home</Nav.Link>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="properties-dropdown" className="px-3">
                  Properties
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Houses</Dropdown.Item>
                  <Dropdown.Item>Apartments</Dropdown.Item>
                  <Dropdown.Item>Land</Dropdown.Item>
                  <Dropdown.Item>Commercial</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="vehicles-dropdown" className="px-3">
                  Vehicles
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Cars</Dropdown.Item>
                  <Dropdown.Item>Motorcycles</Dropdown.Item>
                  <Dropdown.Item>Trucks</Dropdown.Item>
                  <Dropdown.Item>Buses</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Nav.Link href="#" className="text-white px-3">Machinery</Nav.Link>
              <Nav.Link href="#" className="text-white px-3">Services</Nav.Link>
              <Nav.Link href="#" className="text-white px-3">Blog</Nav.Link>
              <Nav.Link href="#" className="text-white px-3">Contact</Nav.Link>
            </Nav>
            <Button variant="light" className="ms-3">
              Post Free Ad
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Custom CSS */}
      <style jsx>{`
        .top-bar {
          font-size: 0.85rem;
        }
        .social-icons a {
          transition: all 0.3s ease;
        }
        .social-icons a:hover {
          color: #28a745 !important;
          transform: translateY(-2px);
        }
        .search-bar {
          max-width: 600px;
        }
        .user-actions .btn {
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .user-actions .btn:hover {
          background-color: #f8f9fa;
          transform: translateY(-2px);
        }
        .badge {
          font-size: 0.6rem;
          padding: 0.25em 0.4em;
        }
        .dropdown-toggle::after {
          margin-left: 0.5em;
          vertical-align: 0.15em;
        }
      `}</style>
    </header>
  );
}