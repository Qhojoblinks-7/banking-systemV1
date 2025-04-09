import React from 'react';
import './HeroSection.css';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>Your Trusted Banking Partner</h1>
        <p>Manage your accounts, transactions, and loans with ease.</p>
        <Link to="/app" className="sign-up-button">
          Go to App
        </Link>
      </div>
      <div className="hero-image">
        <img src="/banking-app-mockup.png" alt="Banking App Mockup" />
      </div>
    </div>
  );
}

export default HeroSection;