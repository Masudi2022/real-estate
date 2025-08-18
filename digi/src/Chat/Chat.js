import React, { useEffect, useState, useRef } from "react";
import { 
  Container, 
  Card, 
  Form, 
  Button, 
  Spinner, 
  Alert, 
  Badge,
  Image,
  InputGroup
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FiArrowLeft, 
  FiSend, 
  FiPaperclip,
  FiSmile,
  FiMoreVertical
} from "react-icons/fi";
import { BsCheck2All } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";

function ChatPage() {
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ownerDetails, setOwnerDetails] = useState(null);
  const messagesEndRef = useRef(null);

  const access_token = localStorage.getItem("access_token");
  const currentUserId = parseInt(localStorage.getItem("user_id"));

  // Fetch messages and owner details
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch messages
        const messagesResponse = await axios.get(
          `http://127.0.0.1:8000/api/messages/${ownerId}/`,
          { headers: { Authorization: `Bearer ${access_token}` } }
        );
        setMessages(messagesResponse.data);

        // Fetch owner details (you'll need to implement this endpoint)
        const ownerResponse = await axios.get(
          `http://127.0.0.1:8000/api/users/${ownerId}/`,
          { headers: { Authorization: `Bearer ${access_token}` } }
        );
        setOwnerDetails(ownerResponse.data);

      } catch (err) {
        setError("Failed to load chat data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ownerId, access_token]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/messages/`,
        {
          receiver: ownerId,
          message_text: newMessage,
        },
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
    } catch (err) {
      setError("Failed to send message.");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <Container className="chat-container px-0">
      {/* Chat Header */}
      <div className="chat-header bg-primary text-white p-3 d-flex align-items-center">
        <Button 
          variant="link" 
          className="text-white me-2 p-0"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft size={20} />
        </Button>
        
        {ownerDetails && (
          <div className="d-flex align-items-center flex-grow-1">
            <Image 
              src={ownerDetails.avatar || "https://via.placeholder.com/40"}
              roundedCircle
              width={40}
              height={40}
              className="me-3"
            />
            <div>
              <h6 className="mb-0">{ownerDetails.name}</h6>
              <small className="text-white-50">
                {ownerDetails.is_online ? "Online" : "Last seen recently"}
              </small>
            </div>
          </div>
        )}
        
        <Button variant="link" className="text-white p-0 ms-auto">
          <FiMoreVertical size={20} />
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages p-3">
        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        {messages.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-bubble d-flex flex-column mb-3 ${
                msg.sender.id === currentUserId ? "align-items-end" : "align-items-start"
              }`}
            >
              <div
                className={`message-content d-flex ${
                  msg.sender.id === currentUserId ? "justify-content-end" : "justify-content-start"
                }`}
              >
                {msg.sender.id !== currentUserId && (
                  <Image 
                    src={ownerDetails?.avatar || "https://via.placeholder.com/32"}
                    roundedCircle
                    width={32}
                    height={32}
                    className="me-2 align-self-end"
                  />
                )}
                
                <div
                  className={`message-text p-3 ${
                    msg.sender.id === currentUserId 
                      ? "bg-primary text-white" 
                      : "bg-light"
                  }`}
                >
                  {msg.message_text}
                  <div className="message-meta d-flex justify-content-end align-items-center mt-1">
                    <small className={`${
                      msg.sender.id === currentUserId ? "text-white-50" : "text-muted"
                    }`}>
                      {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                    </small>
                    {msg.sender.id === currentUserId && (
                      <BsCheck2All className="ms-2" size={14} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="chat-input p-3 bg-light border-top">
        <Form onSubmit={handleSendMessage}>
          <InputGroup>
            <Button variant="link" className="text-secondary">
              <FiPaperclip size={20} />
            </Button>
            <Form.Control
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="border-0 bg-white"
            />
            <Button variant="link" className="text-secondary">
              <FiSmile size={20} />
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={!newMessage.trim()}
              className="rounded-circle"
            >
              <FiSend size={18} />
            </Button>
          </InputGroup>
        </Form>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .chat-container {
          max-width: 600px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 0;
          background-color: #f8f9fa;
        }
        .chat-header {
          position: sticky;
          top: 0;
          z-index: 10;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          background-color: #f0f2f5;
          padding-bottom: 80px;
        }
        .chat-input {
          position: fixed;
          bottom: 0;
          width: 100%;
          max-width: 600px;
          box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
        }
        .message-bubble {
          transition: all 0.3s ease;
        }
        .message-content {
          max-width: 80%;
        }
        .message-text {
          border-radius: 18px;
          position: relative;
          word-break: break-word;
          box-shadow: 0 1px 1px rgba(0,0,0,0.1);
        }
        .message-text.bg-primary {
          border-bottom-right-radius: 4px;
        }
        .message-text.bg-light {
          border-bottom-left-radius: 4px;
        }
        .message-meta {
          font-size: 0.75rem;
          line-height: 1;
        }
        .form-control:focus {
          box-shadow: none;
        }
      `}</style>
    </Container>
  );
}

export default ChatPage;