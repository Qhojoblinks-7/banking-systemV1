import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import SimplifySection from './components/SimplifySection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';
import AuthForm from './components/AuthForm';
import AccountSummary from './components/AccountSummary';
import LoanApplicationForm from './components/LoanApplicationForm';
import AccountsPage from './components/AccountsPage';
import TransactionsPage from './components/TransactionsPage';
import ProfilePage from './components/ProfilePage';
import BottomNavigationBar from './components/BottomNavigationBar';
import supabase from './supabaseClient';
import './App.css';

function App() {
  const [currentCustomerId, setCurrentCustomerId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    setIsMobile(mobileRegex.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentCustomerId(session?.user?.id || null);

      // Redirect logic on mount
      if (session?.user?.id && isMobile) {
        if (window.location.pathname === '/app' || window.location.pathname === '/auth') {
          navigate('/account'); // Redirect to the mobile app's home page
        }
      } else if (session?.user?.id && !isMobile) {
        if (window.location.pathname === '/app' || window.location.pathname === '/auth' || window.location.pathname === '/account' || window.location.pathname === '/apply-loan' || window.location.pathname === '/home' || window.location.pathname === '/accounts' || window.location.pathname === '/transactions' || window.location.pathname === '/profile') {
          navigate('/'); // Redirect desktop users to the landing page
        }
      } else if (!session?.user?.id && (window.location.pathname === '/account' || window.location.pathname === '/apply-loan' || window.location.pathname === '/home' || window.location.pathname === '/accounts' || window.location.pathname === '/transactions' || window.location.pathname === '/profile')) {
        navigate('/app'); // Redirect to the login/signup page if not logged in
      }
    };

    getSession();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      setCurrentCustomerId(session?.user?.id || null);

      // Redirect logic on auth state change
      if (session?.user?.id && isMobile) {
        if (window.location.pathname === '/app' || window.location.pathname === '/auth') {
          navigate('/account');
        }
      } else if (session?.user?.id && !isMobile) {
        if (window.location.pathname === '/app' || window.location.pathname === '/auth' || window.location.pathname === '/account' || window.location.pathname === '/apply-loan' || window.location.pathname === '/account' || window.location.pathname === '/accounts' || window.location.pathname === '/transactions' || window.location.pathname === '/profile') {
          navigate('/');
        }
      } else if (!session?.user?.id && (window.location.pathname === '/account' || window.location.pathname === '/apply-loan' || window.location.pathname === '/home' || window.location.pathname === '/accounts' || window.location.pathname === '/transactions' || window.location.pathname === '/profile')) {
        navigate('/app');
      }
    });
  }, [navigate, isMobile]);

  // Redirect non-mobile users trying to access app routes
  if (!isMobile && (window.location.pathname === '/account' || window.location.pathname === '/apply-loan' || window.location.pathname === '/auth' || window.location.pathname === '/app' || window.location.pathname === '/home' || window.location.pathname === '/accounts' || window.location.pathname === '/transactions' || window.location.pathname === '/profile')) {
    return (
      <div className="mobile-only-message-app">
        This application is designed for mobile devices only. Please access it on a smartphone or smartwatch.
      </div>
    );
  }

  return (
    <div className="app-container">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <FeaturesSection />
              <SimplifySection />
              <TestimonialsSection />
              <Footer />
            </>
          }
        />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/app" element={<Navigate to="/auth" />} /> {/* Redirect /app to /auth */}
        <Route
          path="/account"
          element={currentCustomerId ? <AccountSummary customerId={currentCustomerId} /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/apply-loan"
          element={currentCustomerId ? <LoanApplicationForm customerId={currentCustomerId} /> : <Navigate to="/auth" replace />}
        />
        {/* Mobile App Routes */}
        <Route
          path="/account"
          element={currentCustomerId ? <AccountSummary customerId={currentCustomerId} /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/accounts"
          element={currentCustomerId ? <AccountsPage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/transactions"
          element={currentCustomerId ? <TransactionsPage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/profile"
          element={currentCustomerId ? <ProfilePage /> : <Navigate to="/auth" replace />}
        />
      </Routes>
      {isMobile && currentCustomerId && (window.location.pathname === '/home' || window.location.pathname === '/accounts' || window.location.pathname === '/transactions' || window.location.pathname === '/profile') && <BottomNavigationBar />}
    </div>
  );
}

export default App;