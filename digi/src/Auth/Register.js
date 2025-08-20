import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Card, Container, Row, Col, Alert } from "react-bootstrap";
import { FaUser, FaLock, FaEnvelope, FaPhone, FaUserTie } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    role: "Buyer", // default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Something went wrong");
      }

      // ✅ After successful register → go to login
      navigate("/login");
    } catch (err) {
      setError("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Container className="h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col xs={12} md={8} lg={6} xl={5}>
            <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="register-header text-white text-center p-4">
                <h2 className="mb-1">Create Account</h2>
                <p className="mb-0">Join us and start your journey</p>
              </div>

              <Card.Body className="p-4 p-md-5">
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  {/* First Name */}
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center">
                      <FaUser className="me-2" /> First Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      placeholder="Enter first name"
                      value={form.first_name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* Last Name */}
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center">
                      <FaUserTie className="me-2" /> Last Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      placeholder="Enter last name"
                      value={form.last_name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* Email */}
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center">
                      <MdOutlineAlternateEmail className="me-2" /> Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center">
                      <FaLock className="me-2" /> Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* Phone Number */}
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center">
                      <FaPhone className="me-2" /> Phone Number
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="phone_number"
                      placeholder="Enter phone number"
                      value={form.phone_number}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  {/* Role Selection */}
                  <Form.Group className="mb-4">
                    <Form.Label className="d-flex align-items-center">
                      <FaUserTie className="me-2" /> Choose Role
                    </Form.Label>
                    <div className="d-flex gap-3">
                      <Form.Check
                        type="radio"
                        label="Buyer"
                        name="role"
                        value="Buyer"
                        checked={form.role === "Buyer"}
                        onChange={handleChange}
                      />
                      <Form.Check
                        type="radio"
                        label="Seller"
                        name="role"
                        value="Seller"
                        checked={form.role === "Seller"}
                        onChange={handleChange}
                      />
                    </div>
                  </Form.Group>

                  {/* Submit Button */}
                  <Button
                    variant="success"
                    type="submit"
                    className="w-100 py-2 fw-bold rounded-pill"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register"}
                  </Button>

                  <div className="text-center mt-3">
                    <p className="mb-0">
                      Already have an account?{" "}
                      <Link to="/login" className="text-success fw-bold text-decoration-none">
                        Login
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Custom CSS */}
      <style jsx>{`
        .register-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px 0;
        }
        .register-header {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        }
        .form-control:focus {
          box-shadow: none;
          border-color: #28a745;
        }
      `}</style>
    </div>
  );
};

export default Register;
