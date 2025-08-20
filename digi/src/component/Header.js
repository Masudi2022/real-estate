import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav, Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import { FaPhoneAlt, FaUser, FaSearch, FaHome, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setUser(null); // Ensure user is null when no token exists
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/user/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null); // Set user to null on error
      }
    };

    fetchUser();
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className={`sticky-top ${scrolled ? 'header-scrolled' : ''}`}>
      {/* Top Contact Bar */}
      <div className="top-bar bg-primary text-white py-2">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className="me-3"><FaPhoneAlt className="me-2" /> +255-777-000-111</span>
            <span><MdLocationOn className="me-2" /> Zanzibar, Tanzania</span>
          </div>
          {user ? (
            <span className="d-none d-md-block">
              Welcome
            </span>
          ) : null}
        </Container>
      </div>

      {/* Main Navigation */}
      <Navbar expand="lg" className="main-navbar py-3">
        <Container>
          <Navbar.Brand href="/" className="d-flex align-items-center">
            <img 
              src="https://via.placeholder.com/180x50?text=REALESTATE" 
              alt="Company Logo" 
              className="brand-logo"
            />
          </Navbar.Brand>

          <div className="search-bar mx-lg-4 flex-grow-1">
            <InputGroup>
              <Form.Control 
                type="search" 
                placeholder="Search properties..." 
                className="search-input border-end-0"
              />
              <Button variant="primary" className="search-button">
                <FaSearch />
              </Button>
            </InputGroup>
          </div>

          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>

          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="align-items-center">
              {/* Main Navigation Links */}
              <Nav.Link href="/dashboard" className="nav-link mx-2">
                <FaHome className="me-1" /> Home
              </Nav.Link>
              <Nav.Link href="/about" className="nav-link mx-2">
                <FaInfoCircle className="me-1" /> About
              </Nav.Link>
              <Nav.Link href="/contact" className="nav-link mx-2">
                <FaEnvelope className="me-1" /> Contact
              </Nav.Link>

              {/* User Actions - Only show when logged in */}
              {user ? (
                <Dropdown className="ms-lg-3">
                  <Dropdown.Toggle variant="outline-primary" id="user-dropdown" className="user-dropdown">
                    <FaUser className="me-2" /> Account
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end" className="dropdown-menu-end">
                    <Dropdown.Item href="/profile">My Profile</Dropdown.Item>
                    {user.role === "Seller" && (
                      <Dropdown.Item href="/seller/dashboard">Seller Dashboard</Dropdown.Item>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div className="d-flex ms-lg-3">
                  <Button 
                    variant="outline-primary" 
                    className="me-2" 
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <style jsx global>{`
        :root {
          --primary-color: #2c3e50;
          --secondary-color: #3498db;
          --text-color: #333;
          --light-bg: #f8f9fa;
        }
        
        .top-bar {
          font-size: 0.9rem;
        }
        
        .main-navbar {
          background-color: white;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .header-scrolled .main-navbar {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .brand-logo {
          height: 40px;
          transition: all 0.3s ease;
        }
        
        .search-bar {
          max-width: 500px;
        }
        
        .search-input {
          border-radius: 4px 0 0 4px !important;
          border-color: #ddd;
        }
        
        .search-button {
          border-radius: 0 4px 4px 0 !important;
        }
        
        .nav-link {
          color: var(--text-color) !important;
          font-weight: 500;
          padding: 0.5rem 1rem !important;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .nav-link:hover, .nav-link:focus {
          color: var(--secondary-color) !important;
          background-color: rgba(52, 152, 219, 0.1);
        }
        
        .nav-link.active {
          color: var(--secondary-color) !important;
          font-weight: 600;
        }
        
        .user-dropdown {
          border-radius: 4px;
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
        }
        
        @media (max-width: 991.98px) {
          .search-bar {
            margin: 1rem 0;
            width: 100%;
          }
          
          .nav-link {
            margin: 0.25rem 0 !important;
          }
        }
      `}</style>
    </header>
  );
}