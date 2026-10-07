
import React, { useState } from 'react';
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="cf-navbar">
      <div className="cf-container cf-nav-wrapper">
        <div className="cf-logo">
          Campus<span>Find</span>
        </div>

        <div className="cf-nav-links">
          <a href="#home">Home</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#categories">Categories</a>
          <a href="#browse">Browse Items</a>
        </div>

        <button className="cf-nav-btn">Sign In</button>

        <button
          className="cf-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>
    </nav>
  );
}