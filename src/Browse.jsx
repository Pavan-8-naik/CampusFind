import { useState } from "react";

function Browse({ onBack }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [category, setCategory] = useState("All");

  const items = [
    {
      id: 1,
      name: "Black Wallet",
      type: "Lost",
      category: "Wallet & Money",
      location: "Central Library",
      date: "Today",
      icon: "👛",
      description: "Black leather wallet with a small scratch.",
    },
    {
      id: 2,
      name: "iPhone 15",
      type: "Lost",
      category: "Electronics",
      location: "Block A",
      date: "Today",
      icon: "📱",
      description: "Black iPhone with transparent case.",
    },
    {
      id: 3,
      name: "Black Backpack",
      type: "Found",
      category: "Bags",
      location: "Computer Lab",
      date: "Yesterday",
      icon: "🎒",
      description: "Black backpack found near a classroom.",
    },
    {
      id: 4,
      name: "Car Keys",
      type: "Lost",
      category: "Keys",
      location: "Parking Area",
      date: "Yesterday",
      icon: "🔑",
      description: "Silver keys with a blue keychain.",
    },
    {
      id: 5,
      name: "Student ID Card",
      type: "Found",
      category: "Other",
      location: "Cafeteria",
      date: "2 days ago",
      icon: "🪪",
      description: "Student ID card found near the cafeteria.",
    },
    {
      id: 6,
      name: "Blue Notebook",
      type: "Found",
      category: "Books",
      location: "Library",
      date: "2 days ago",
      icon: "📓",
      description: "Blue notebook with handwritten notes.",
    },
  ];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      type === "All" || item.type === type;

    const matchesCategory =
      category === "All" || item.category === category;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="browse-page">

      {/* Header */}
      <div className="browse-topbar">

        <button className="back-btn" onClick={onBack}>
          ← Back to CampusFind
        </button>

        <div className="report-logo">
          Campus<span>Find</span>
        </div>

      </div>

      {/* Main */}
      <div className="browse-wrapper">

        <div className="browse-heading">
          <p className="small-title">
            CAMPUSFIND DATABASE
          </p>

          <h1>
            Browse lost & found items
          </h1>

          <p>
            Search through reported items and find a
            possible match.
          </p>
        </div>

        {/* Search */}
        <div className="browse-search">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search item, description or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* Filters */}
        <div className="filters">

          <div className="filter-group">

            <label>Type</label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>All</option>
              <option>Lost</option>
              <option>Found</option>
            </select>

          </div>

          <div className="filter-group">

            <label>Category</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>All</option>
              <option>Electronics</option>
              <option>Wallet & Money</option>
              <option>Keys</option>
              <option>Bags</option>
              <option>Books</option>
              <option>Other</option>
            </select>

          </div>

          <div className="result-count">
            <strong>{filteredItems.length}</strong>
            <span>items found</span>
          </div>

        </div>

        {/* Items */}
        <div className="browse-grid">

          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div className="browse-card" key={item.id}>

                <div className="browse-image">
                  {item.icon}
                </div>

                <div className="browse-card-content">

                  <div className="card-top">

                    <span
                      className={
                        item.type === "Lost"
                          ? "lost-badge"
                          : "found-badge"
                      }
                    >
                      {item.type.toUpperCase()}
                    </span>

                    <span className="match-label">
                      {item.type === "Lost"
                        ? "Looking for match"
                        : "Potential match"}
                    </span>

                  </div>

                  <h2>{item.name}</h2>

                  <p className="browse-description">
                    {item.description}
                  </p>

                  <div className="item-meta">

                    <span>📍 {item.location}</span>

                    <span>🕒 {item.date}</span>

                  </div>

                  <div className="card-bottom">

                    <span className="category-label">
                      {item.category}
                    </span>

                    <button className="details-btn">
                      View Details →
                    </button>

                  </div>

                </div>

              </div>
            ))
          ) : (
            <div className="no-results">

              <div>🔍</div>

              <h2>No items found</h2>

              <p>
                Try changing your search or filters.
              </p>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Browse;