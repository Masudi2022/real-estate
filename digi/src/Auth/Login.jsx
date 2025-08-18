import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope, FaSignInAlt, FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // API URL variable
  const API_URL = "http://127.0.0.1:8000/api/auth/login/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call Django JWT login endpoint
      const response = await axios.post(API_URL, { email, password });

      const { access, refresh } = response.data;

      if (!access || !refresh) {
        throw new Error("Invalid login response");
      }

      // Save tokens in localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // Redirect to dashboard after successful login
      navigate("/dashboard");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || "Login failed");
      } else {
        setError(err.message || "Network error, please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container className="h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col xs={12} md={8} lg={6} xl={5}>
            <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="login-header text-white text-center p-4">
                <h2 className="mb-1">Welcome Back</h2>
                <p className="mb-0">Please login to your account</p>
              </div>

              <Card.Body className="p-4 p-md-5">
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="d-flex align-items-center">
                      <MdOutlineAlternateEmail className="me-2" />
                      Email Address
                    </Form.Label>
                    <div className="input-group">
                      <span className="input-group-text"><FaEnvelope /></span>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="py-2"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="d-flex align-items-center">
                      <FaLock className="me-2" />
                      Password
                    </Form.Label>
                    <div className="input-group">
                      <span className="input-group-text"><FaLock /></span>
                      <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="py-2"
                      />
                    </div>
                    <div className="text-end mt-2">
                      <a href="#forgot-password" className="text-decoration-none text-success small">
                        Forgot Password?
                      </a>
                    </div>
                  </Form.Group>

                  <Button
                    variant="success"
                    type="submit"
                    className="w-100 py-2 fw-bold rounded-pill"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : <><FaSignInAlt className="me-2" /> Sign In</>}
                  </Button>

                  <div className="divider d-flex align-items-center my-4">
                    <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
                  </div>

                  <div className="d-flex justify-content-center gap-3 mb-4">
                    <Button variant="outline-danger" className="rounded-circle social-btn"><FaGoogle /></Button>
                    <Button variant="outline-primary" className="rounded-circle social-btn"><FaFacebook /></Button>
                    <Button variant="outline-info" className="rounded-circle social-btn"><FaTwitter /></Button>
                  </div>

                  <div className="text-center">
                    <p className="mb-0">
                      Don't have an account?{" "}
                      <a href="#register" className="text-success fw-bold text-decoration-none">Sign Up</a>
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
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px 0;
        }
        .login-header {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        }
        .input-group-text {
          background-color: #f8f9fa;
          border-right: none;
        }
        .form-control {
          border-left: none;
        }
        .form-control:focus {
          box-shadow: none;
          border-color: #ced4da;
        }
        .social-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .divider:after,
        .divider:before {
          content: "";
          flex: 1;
          height: 1px;
          background: #eee;
        }
      `}</style>
    </div>
  );
}

export default Login;
