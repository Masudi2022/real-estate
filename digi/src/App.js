import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Pages
import HomePage from "./Home/Home";
import Login from "./Auth/Login";
import Dashboard from "./Dashboard/dashboard";
import ListingDetails from "./Dashboard/ListingDetails";
import ChatPage from "./Chat/Chat";

// Components
import ProtectedRoute from "./Auth/ProtectedRoute";
import Header from "./component/Header";
import Footer from "./component/Footer";

function AppContent() {
  const location = useLocation();
  const noHeaderFooter = location.pathname === '/login';

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      {!noHeaderFooter && <Header />}
      <main className="flex-fill">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/listings/:slug" 
            element={
              <ProtectedRoute>
                <ListingDetails />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/chat/:ownerId"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!noHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
