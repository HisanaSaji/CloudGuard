import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import DetailPage from "./pages/DetailPage";
import Login from "./pages/Login";
import MapPage from "./pages/MapPage";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white font-inter">Loading application...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/detail" element={
          <ProtectedRoute>
            <DetailPage />
          </ProtectedRoute>
        } />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </Router>
  );
}

export default App;