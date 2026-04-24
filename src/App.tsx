/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { ServerDetails } from './pages/ServerDetails';
import { Status } from './pages/Status';
import { CookieConsent } from './components/CookieConsent';

import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { AboutUs } from './pages/AboutUs';
import { ForgotPassword } from './pages/ForgotPassword';
import { AdminPanel } from './pages/AdminPanel';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppContent() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/server/:id" element={
            <ProtectedRoute>
              <ServerDetails />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/*" element={
            <>
              <Navbar />
              <div className="flex-grow">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/status" element={<Status />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/about-us" element={<AboutUs />} />
                </Routes>
              </div>
              <Footer />
              <CookieConsent />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

