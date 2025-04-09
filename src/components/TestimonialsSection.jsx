import React from 'react';
import './TestimonialsSection.css'; // Assuming you have this CSS

function TestimonialsSection() {
  const testimonials = [
    { name: 'Sarah M.', quote: 'Managing my finances has never been easier. This banking app is a game-changer!' },
    { name: 'John B.', quote: 'The loan application process was so smooth and transparent. Highly recommended.' },
    // Add more testimonials relevant to a banking app
  ];

  return (
    <div className="testimonials-section">
      <h2>What Our Users Say</h2>
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <p className="quote">"{testimonial.quote}"</p>
            <p className="name">- {testimonial.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestimonialsSection;