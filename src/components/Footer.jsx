import React from 'react';

export default function Footer() {
  return (
    <footer className="cf-footer">
      <div className="cf-container">
        <div className="cf-footer-grid">
          <div className="cf-footer-brand">
            <h2>CampusFind</h2>
            <p>
              Smart lost and found community portal designed to streamline lost property recovery across campus grounds.
            </p>
          </div>
          <div className="cf-footer-links">
            <h4>Navigation</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#categories">Categories</a></li>
            </ul>
          </div>
          <div className="cf-footer-links">
            <h4>Safety</h4>
            <ul>
              <li><a href="#support">Campus Security Desk</a></li>
              <li><a href="#verify">Verification Rules</a></li>
            </ul>
          </div>
        </div>
        <div className="cf-footer-bottom">
          &copy; {new Date().getFullYear()} CampusFind. All rights reserved.
        </div>
      </div>
    </footer>
  );
}