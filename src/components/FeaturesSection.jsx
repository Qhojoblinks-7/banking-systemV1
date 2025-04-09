import React from 'react';
import './FeaturesSection.css'; // Assuming you have this CSS

function FeaturesSection() {
  const features = [
    { title: 'Account Management', description: 'View balances, transaction history, and manage your accounts effortlessly.' },
    { title: 'Seamless Transactions', description: 'Make and receive payments quickly and securely.' },
    { title: 'Loan Applications', description: 'Apply for loans online with transparent processes.' },
    { title: 'Secure & Reliable', description: 'Your data and transactions are protected with advanced security measures.' },
    { title: 'Notifications & Alerts', description: 'Stay informed about your account activity with timely notifications.' },
    { title: '24/7 Access', description: 'Access your banking services anytime, anywhere.' },
  ];

  return (
    <div className="features-section">
      <h2>Key Features</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturesSection;