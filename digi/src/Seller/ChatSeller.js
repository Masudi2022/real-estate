import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner, Card } from "react-bootstrap";
import { FiArrowLeft } from "react-icons/fi";
import axios from "axios";

function ChatSeller() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationLoading, setConversationLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [messages, setMessages] = useState([]);
  const userId = parseInt(localStorage.getItem("user_id")); // Get logged-in user ID
  const messagesEndRef = useRef(null); // For scrolling to bottom

  // Extract and log parameters
  const { listingId, bookingId, buyerId } = state || {};
  console.log("Navigation state:", { listingId, bookingId, buyerId });

  // Fetch conversation history
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        const response = await axios.get(
          `http://127.0.0.1:8000/api/messages/conversation/${buyerId}/`,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );
        console.log("Conversation response:", response.data);
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching conversation:", err.response?.data);
        setError("Failed to load conversation. Please try again.");
      } finally {
        setConversationLoading(false);
      }
    };

    if (buyerId) {
      fetchConversation();
    }
  }, [buyerId]);

  // Scroll to bottom of messages when they update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const access_token = localStorage.getItem("access_token");
      console.log("Sending payload:", {
        receiver: buyerId,
        listing: listingId,
        booking: bookingId,
        message_text: message,
      });
      const response = await axios.post(
        "http://127.0.0.1:8000/api/messages/send/",
        {
          receiver: buyerId,
          listing: listingId,
          booking: bookingId,
          message_text: message,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setSuccess("Message sent successfully!");
      setMessage("");
      // Append new message
      setMessages([...messages, response.data]);
      console.log("Send response:", response.data);
    } catch (err) {
      console.log("Error response:", err.response?.data);
      setError(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!listingId || !bookingId || !buyerId) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          Invalid navigation parameters. Please go back and try again.
        </Alert>
        <Button
          variant="outline-primary"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft className="me-2" /> Back
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button
        variant="outline-primary"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <FiArrowLeft className="me-2" /> Back
      </Button>

      <h2 className="mb-4">
        Chat with Customer (Listing #{listingId}, Booking #{bookingId})
      </h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Conversation Display */}
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          marginBottom: "20px",
          padding: "10px",
          border: "1px solid #dee2e6",
          borderRadius: "5px",
        }}
      >
        {conversationLoading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : messages.length === 0 ? (
          <Alert variant="info">No messages yet. Start the conversation!</Alert>
        ) : (
          messages.map((msg) => (
            <Card
              key={msg.id}
              className="mb-2"
              style={{
                maxWidth: "70%",
                marginLeft: msg.sender.id === userId ? "auto" : "0",
                marginRight: msg.sender.id === userId ? "10px" : "auto",
                backgroundColor: msg.sender.id === userId ? "#007bff" : "#f8f9fa",
                color: msg.sender.id === userId ? "white" : "black",
              }}
            >
              <Card.Body>
                <Card.Text>{msg.message_text}</Card.Text>
                <Card.Subtitle
                  className="text-muted"
                  style={{ fontSize: "0.8em" }}
                >
                  {msg.sender.id === userId
                    ? "You"
                    : `${msg.sender.first_name} ${msg.sender.last_name}`}
                  {" • "}
                  {new Date(msg.sent_at).toLocaleString()}
                  {msg.is_read ? " • Read" : ""}
                </Card.Subtitle>
              </Card.Body>
            </Card>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <Form onSubmit={handleSendMessage}>
        <Form.Group controlId="message" className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            required
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          disabled={loading || !message.trim()}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </Form>
    </Container>
  );
}

export default ChatSeller;