import React from 'react';
import './SimplifySection.css'; // Assuming you have this CSS

function SimplifySection() {
  const steps = [
    { number: 1, title: 'Create Your Account', description: 'Sign up quickly with your basic information to get started.' },
    { number: 2, title: 'Link Your Accounts', description: 'Securely connect your existing bank accounts for a unified view.' },
    { number: 3, title: 'Manage Your Finances', description: 'Track your balance, view transactions, and apply for loans all in one place.' },
  ];

  return (
    <div className="simplify-section">
      <h2>Banking Made Simple</h2>
      <div className="steps-container">
        {steps.map((step) => (
          <div key={step.number} className="step-card">
            <div className="step-number">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
      <div className="simplify-image">
        {/* Replace with an image of the banking app interface */}
        <img src="/banking-app-interface.png" alt="Banking App Interface" />
      </div>
    </div>
  );
}

export default SimplifySection;