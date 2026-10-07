import React from 'react';

const categories = [
  { name: 'Student IDs & Wallets', icon: '💳', items: '12 active' },
  { name: 'Laptops & Electronics', icon: '💻', items: '8 active' },
  { name: 'Keys & Accessories', icon: '🔑', items: '15 active' },
  { name: 'Books & Notebooks', icon: '📚', items: '9 active' },
  { name: 'Water Bottles', icon: '🧴', items: '21 active' },
  { name: 'Backpacks & Bags', icon: '🎒', items: '6 active' }
];

export default function Categories() {
  return (
    <section id="categories" className="cf-section">
      <div className="cf-container">
        <div className="cf-section-header">
          <h2 className="cf-section-title">Browse by Category</h2>
          <p className="cf-section-subtitle">Quickly filter by item type</p>
        </div>
        <div className="cf-categories-grid">
          {categories.map((c) => (
            <div key={c.name} className="cf-category-card">
              <span className="cf-cat-icon">{c.icon}</span>
              <div className="cf-cat-info">
                <h3>{c.name}</h3>
                <p>{c.items}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}