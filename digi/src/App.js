import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Pages
import HomePage from "./Home/Home";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Dashboard from "./Dashboard/dashboard";
import SellerDashboard from "./Seller/SellerDasdhboard" // ✅ Seller Dashboard
import ListingDetails from "./Dashboard/ListingDetails";
import Chat from "./Chat/Chat";
import SellerListingDetail from "./Seller/SellerListingdetails";
import ProfilePage from "./Auth/ProfilePage";
import Booking from "./Dashboard/Booking"; // Import the new Booking component
import AllBookings from "./Seller/AllBookings";
import PropertyBookings from "./Dashboard/PropertyBookings";
import ChatSeller from "./Seller/ChatSeller";

// Components
import ProtectedRoute from "./Auth/ProtectedRoute";
import Header from "./component/Header";
import Footer from "./component/Footer";


function AppContent() {
  const location = useLocation();
  const noHeaderFooter = location.pathname === '/login' || location.pathname === '/register'; // hide header/footer for auth pages

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      {!noHeaderFooter && <Header />}
      <main className="flex-fill">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Dashboard */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Seller Dashboard */}
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/listing/:title" 
            element={
              <ProtectedRoute>
                <SellerListingDetail />
              </ProtectedRoute>
            } 
          />

          {/* Listing details */}
          <Route 
            path="/listings/:slug" 
            element={
              <ProtectedRoute>
                <ListingDetails />
              </ProtectedRoute>
            } 
          />

          {/* Booking */}
          <Route 
            path="/booking/:id" 
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            } 
          />

          {/* All Booking */}
          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute>
                <AllBookings />
              </ProtectedRoute>
            } 
          />

          <Route 
          path="/booking/property/:propertyId" 
          element={<PropertyBookings />} 
          />

          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />

          {/* Chat */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

           <Route
            path="/chat-seller"
            element={
              <ProtectedRoute>
                <ChatSeller />
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