import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "./firebase";

function Browse({ onBack }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [category, setCategory] = useState("All");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Selected item for details popup
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const itemsQuery = query(
      collection(db, "items"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      itemsQuery,
      (snapshot) => {
        const firestoreItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setItems(firestoreItems);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading items:", err);
        setError("Unable to load items. Please try again.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredItems = items.filter((item) => {
    const itemName = item.itemName || "";
    const description = item.description || "";
    const location = item.location || "";

    const searchText = search.toLowerCase();

    const matchesSearch =
      itemName.toLowerCase().includes(searchText) ||
      description.toLowerCase().includes(searchText) ||
      location.toLowerCase().includes(searchText);

    const matchesType =
      type === "All" || item.type === type;

    const matchesCategory =
      category === "All" || item.category === category;

    return (
      matchesSearch &&
      matchesType &&
      matchesCategory
    );
  });

  return (
    <div className="browse-page">

      {/* ================= HEADER ================= */}

      <div className="browse-topbar">

        <button
          className="back-btn"
          onClick={onBack}
        >
          ← Back to CampusFind
        </button>

        <div className="report-logo">
          Campus<span>Find</span>
        </div>

      </div>

      {/* ================= MAIN CONTENT ================= */}

      <div className="browse-wrapper">

        {/* Heading */}

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

        {/* ================= SEARCH ================= */}

        <div className="browse-search">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search item, description or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* ================= FILTERS ================= */}

        <div className="filters">

          <div className="filter-group">

            <label>
              Type
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="All">
                All
              </option>

              <option value="Lost">
                Lost
              </option>

              <option value="Found">
                Found
              </option>
            </select>

          </div>

          <div className="filter-group">

            <label>
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">
                All
              </option>

              <option value="Electronics">
                Electronics
              </option>

              <option value="Wallet & Money">
                Wallet & Money
              </option>

              <option value="Keys">
                Keys
              </option>

              <option value="Bags">
                Bags
              </option>

              <option value="Books">
                Books
              </option>

              <option value="Clothing">
                Clothing
              </option>

              <option value="Accessories">
                Accessories
              </option>

              <option value="Other">
                Other
              </option>
            </select>

          </div>

          <div className="result-count">

            <strong>
              {filteredItems.length}
            </strong>

            <span>
              items found
            </span>

          </div>

        </div>

        {/* ================= ITEMS ================= */}

        <div className="browse-grid">

          {/* Loading */}

          {loading && (
            <div className="no-results">

              <div>
                ⏳
              </div>

              <h2>
                Loading items...
              </h2>

              <p>
                Getting the latest lost & found reports.
              </p>

            </div>
          )}

          {/* Error */}

          {!loading && error && (
            <div className="no-results">

              <div>
                ⚠️
              </div>

              <h2>
                Unable to load items
              </h2>

              <p>
                {error}
              </p>

            </div>
          )}

          {/* Items */}

          {!loading &&
            !error &&
            filteredItems.length > 0 &&
            filteredItems.map((item) => (

              <div
                className="browse-card"
                key={item.id}
              >

                {/* Image */}

                <div className="browse-image">

                  {item.photoURL ? (
                    <img
                      src={item.photoURL}
                      alt={item.itemName || "Reported item"}
                    />
                  ) : (
                    <div className="no-photo-icon">
                      📦
                    </div>
                  )}

                </div>

                {/* Card Content */}

                <div className="browse-card-content">

                  <div className="card-top">

                    <span
                      className={
                        item.type === "Lost"
                          ? "lost-badge"
                          : "found-badge"
                      }
                    >
                      {(item.type || "Unknown").toUpperCase()}
                    </span>

                    <span className="match-label">
                      {item.type === "Lost"
                        ? "Looking for match"
                        : "Potential match"}
                    </span>

                  </div>

                  <h2>
                    {item.itemName}
                  </h2>

                  <p className="browse-description">
                    {item.description}
                  </p>

                  <div className="item-meta">

                    <span>
                      📍 {item.location}
                    </span>

                    <span>
                      🕒 {item.date}
                    </span>

                  </div>

                  <div className="card-bottom">

                    <span className="category-label">
                      {item.category}
                    </span>

                    <button
                      type="button"
                      className="details-btn"
                      onClick={() => {
                        console.log(
                          "Opening details:",
                          item
                        );

                        setSelectedItem(item);
                      }}
                    >
                      View Details →
                    </button>

                  </div>

                </div>

              </div>

            ))}

          {/* No Results */}

          {!loading &&
            !error &&
            filteredItems.length === 0 && (
              <div className="no-results">

                <div>
                  🔍
                </div>

                <h2>
                  No items found
                </h2>

                <p>
                  Try changing your search or filters.
                </p>

              </div>
            )}

        </div>

      </div>

      {/* ================================================= */}
      {/* DETAILS POPUP */}
      {/* ================================================= */}

      {selectedItem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 99999,
          }}
          onClick={() => setSelectedItem(null)}
        >

          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "850px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >

            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                width: "40px",
                height: "40px",
                border: "none",
                borderRadius: "50%",
                background: "#ffffff",
                color: "#111111",
                fontSize: "28px",
                lineHeight: "40px",
                cursor: "pointer",
                zIndex: 10,
                boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
              }}
            >
              ×
            </button>

            {/* IMAGE */}

            <div
              style={{
                minHeight: "420px",
                background: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >

              {selectedItem.photoURL ? (
                <img
                  src={selectedItem.photoURL}
                  alt={
                    selectedItem.itemName ||
                    "Reported item"
                  }
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "420px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: "80px",
                  }}
                >
                  📦
                </div>
              )}

            </div>

            {/* DETAILS */}

            <div
              style={{
                padding: "40px",
              }}
            >

              {/* STATUS */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "18px",
                  flexWrap: "wrap",
                }}
              >

                <span
                  className={
                    selectedItem.type === "Lost"
                      ? "lost-badge"
                      : "found-badge"
                  }
                >
                  {(
                    selectedItem.type ||
                    "Unknown"
                  ).toUpperCase()}
                </span>

                <span className="category-label">
                  {selectedItem.category}
                </span>

              </div>

              {/* NAME */}

              <h2
                style={{
                  fontSize: "32px",
                  margin: "0 0 16px",
                  color: "#111111",
                }}
              >
                {selectedItem.itemName}
              </h2>

              {/* DESCRIPTION */}

              <p
                style={{
                  color: "#555555",
                  lineHeight: "1.7",
                  marginBottom: "28px",
                }}
              >
                {selectedItem.description}
              </p>

              {/* INFORMATION */}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >

                <div>
                  <strong>
                    📍 Location
                  </strong>

                  <div
                    style={{
                      marginTop: "5px",
                      color: "#222222",
                    }}
                  >
                    {selectedItem.location}
                  </div>
                </div>

                <div>
                  <strong>
                    📅 Date
                  </strong>

                  <div
                    style={{
                      marginTop: "5px",
                      color: "#222222",
                    }}
                  >
                    {selectedItem.date}
                  </div>
                </div>

                <div>
                  <strong>
                    📞 Contact
                  </strong>

                  <div
                    style={{
                      marginTop: "5px",
                      color: "#222222",
                      wordBreak: "break-word",
                    }}
                  >
                    {selectedItem.contact}
                  </div>
                </div>

              </div>

              {/* CLOSE */}

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                style={{
                  width: "100%",
                  marginTop: "30px",
                  padding: "14px",
                  border: "none",
                  borderRadius: "12px",
                  background: "#111111",
                  color: "#ffffff",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Browse;