import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';

function LoanApplicationForm({ customerId }) {
  // ... (rest of your component logic and state)

  return (
    <div style={mobileOnlyStyles.container} className="loan-application-form">
      <div style={mobileOnlyStyles.mobileContent}>
        <h2 style={mobileOnlyStyles.heading}>Loan Application</h2>
        {/* ... (rest of your form content using mobileOnlyStyles) */}
      </div>
      <div style={mobileOnlyStyles.desktopBlocker}>
        <p>This application is designed for mobile devices only.</p>
        <p>Please access it on a smartphone or tablet.</p>
      </div>
    </div>
  );
}

const mobileOnlyStyles = {
  container: {
    // Base styles for mobile (initially visible)
    padding: '16px',
    margin: '0 auto',
    maxWidth: '600px',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  heading: {
    fontSize: '1.8em',
    marginBottom: '20px',
    color: '#333',
  },
  mobileContent: {
    // Content visible on mobile (initially visible)
  },
  desktopBlocker: {
    display: 'none', // Initially hidden
    padding: '20px',
    backgroundColor: '#f8f8f8',
    border: '1px solid #eee',
    borderRadius: '8px',
    marginTop: '20px',
    color: '#777',
  },
  // ... (rest of your mobile styles)
};

// Media query to hide mobile content and show blocker on larger screens
const mediaQuery = `@media (min-width: 768px) {
  .loan-application-form > div > div:first-child { /* Target mobileContent */
    display: none !important;
  }
  .loan-application-form > div > div:last-child { /* Target desktopBlocker */
    display: flex !important;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh; /* Make it take up the whole viewport */
  }
  .loan-application-form > div {
    padding: 0; /* Remove container padding on desktop */
    max-width: none; /* Remove max width on desktop */
    margin: 0; /* Remove container margin on desktop */
    background-color: #f8f8f8; /* Set background color for the blocker */
  }
}`;

// Inject the media query into the document head
const styleElement = document.createElement('style');
styleElement.textContent = mediaQuery;
document.head.appendChild(styleElement);

export default LoanApplicationForm;