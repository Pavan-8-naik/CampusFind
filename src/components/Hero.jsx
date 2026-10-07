import React from 'react';

export default function Hero() {
  return (
    <section id="home" className="cf-hero">
      <div className="cf-container">
        <span className="cf-badge">Campus Lost &amp; Found Portal</span>
        <h1 className="cf-title">
          Lost Something on Campus? <br />
          <span>We'll Help You Find It.</span>
        </h1>
        <p className="cf-description">
          The central hub for students and faculty to report misplaced belongings, track found valuables, and coordinate safe returns.
        </p>
        <div className="cf-cta-group">
          <button className="cf-btn-lost" onClick={() => alert('Opening Lost Item Form')}>
            Report Lost Item
          </button>
          <button className="cf-btn-found" onClick={() => alert('Opening Found Item Form')}>
            Report Found Item
          </button>
        </div>
      </div>
    </section>
  );
}