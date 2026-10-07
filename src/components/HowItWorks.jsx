import React from 'react';

const steps = [
  {
    step: '01',
    title: 'Report Your Item',
    description: 'Provide details, location tag, and description whether you lost an item or found someone else’s property.'
  },
  {
    step: '02',
    title: 'Match & Verify',
    description: 'Our system indexes matching items by campus spot and timestamp, allowing owners to verify claims.'
  },
  {
    step: '03',
    title: 'Safe Return',
    description: 'Coordinate retrieval safely at designated campus helpdesks or directly between verified students.'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="cf-section cf-section-bg">
      <div className="cf-container">
        <div className="cf-section-header">
          <h2 className="cf-section-title">How It Works</h2>
          <p className="cf-section-subtitle">Connecting lost items with their owners in three steps</p>
        </div>
        <div className="cf-steps-grid">
          {steps.map((s) => (
            <div key={s.step} className="cf-step-card">
              <div className="cf-step-num">{s.step}</div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}