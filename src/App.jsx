import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import SimplifySection from './components/SimplifySection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';
import AuthForm from './components/AuthForm';
import AccountSummary from './components/AccountSummary';
import LoanApplicationForm from './components/LoanApplicationForm'; // Import the LoanApplicationForm
import supabase from './supabaseClient'; // Assuming your Supabase client is in supabaseClient.js
import './App.css';

function App() {
  const [currentCustomerId, setCurrentCustomerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentCustomerId(session?.user?.id || null);

      // Redirect to /account if already logged in on mount
      if (session?.user?.id && (window.location.pathname === '/app' || window.location.pathname === '/auth')) {
        navigate('/account');
      }
    };

    getSession();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      setCurrentCustomerId(session?.user?.id || null);
      // Redirect to /account after login
      if (session?.user?.id && (window.location.pathname === '/app' || window.location.pathname === '/auth')) {
        navigate('/account');
      } else if (!session?.user?.id && window.location.pathname === '/account') {
        navigate('/app'); // Redirect to the form page if logged out on account page
      }
    });
  }, [navigate]);

  return (
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
      <Route path="/app" element={<AuthForm />} /> {/* Route for the "Go to App" button */}
      <Route
        path="/account"
        element={currentCustomerId ? <AccountSummary customerId={currentCustomerId} /> : <div>Please log in.</div>}
      />
      {/* Add this route for the LoanApplicationForm */}
      <Route
        path="/apply-loan"
        element={currentCustomerId ? <LoanApplicationForm customerId={currentCustomerId} /> : <div>Please log in.</div>}
      />
    </Routes>
  );
}

export default App;