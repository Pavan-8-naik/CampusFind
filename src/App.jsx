import { useEffect, useState } from "react";
import "./App.css";

import ReportLost from "./ReportLost";
import ReportFound from "./ReportFound";
import Browse from "./Browse";
import Dashboard from "./Dashboard";
import Login from "./Login";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
} from "firebase/firestore";

import { db } from "./firebase";

function App() {
  const [page, setPage] = useState("home");
  const [recentItems, setRecentItems] = useState([]);

  const [allItems, setAllItems] = useState([]);
  const [matchLoading, setMatchLoading] = useState(true);

  // Load recent reports
  useEffect(() => {
    const itemsQuery = query(
      collection(db, "items"),
      orderBy("createdAt", "desc"),
      limit(3)
    );

    const unsubscribe = onSnapshot(
      itemsQuery,
      (snapshot) => {
        const firestoreItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRecentItems(firestoreItems);
      },
      (error) => {
        console.error("Error loading recent reports:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Load all items for Smart Match
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

        setAllItems(firestoreItems);
        setMatchLoading(false);
      },
      (error) => {
        console.error("Error loading matching items:", error);
        setMatchLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Smart Match calculation
  const calculateMatch = (lostItem, foundItem) => {
    let score = 0;
    const reasons = [];

    const lostName = (lostItem.itemName || "").toLowerCase();
    const foundName = (foundItem.itemName || "").toLowerCase();

    const lostCategory = (lostItem.category || "").toLowerCase();
    const foundCategory = (foundItem.category || "").toLowerCase();

    const lostLocation = (lostItem.location || "").toLowerCase();
    const foundLocation = (foundItem.location || "").toLowerCase();

    const lostDescription = (
      lostItem.description || ""
    ).toLowerCase();

    const foundDescription = (
      foundItem.description || ""
    ).toLowerCase();

    // Same category
    if (
      lostCategory &&
      foundCategory &&
      lostCategory === foundCategory
    ) {
      score += 40;
      reasons.push("Same category");
    }

    // Same location
    if (
      lostLocation &&
      foundLocation &&
      lostLocation === foundLocation
    ) {
      score += 30;
      reasons.push("Same location");
    }

    // Similar item name
    if (
      lostName &&
      foundName &&
      (lostName.includes(foundName) ||
        foundName.includes(lostName))
    ) {
      score += 20;
      reasons.push("Similar item name");
    }

    // Similar description
    if (
      lostDescription &&
      foundDescription &&
      (lostDescription.includes(foundDescription) ||
        foundDescription.includes(lostDescription))
    ) {
      score += 10;
      reasons.push("Similar description");
    }

    return {
      score,
      reasons,
    };
  };

  // Find best Lost + Found match
  let bestMatch = null;

  const lostItems = allItems.filter(
    (item) => item.type === "Lost"
  );

  const foundItems = allItems.filter(
    (item) => item.type === "Found"
  );

  lostItems.forEach((lostItem) => {
    foundItems.forEach((foundItem) => {
      const result = calculateMatch(lostItem, foundItem);

      if (
        result.score > 0 &&
        (!bestMatch || result.score > bestMatch.score)
      ) {
        bestMatch = {
          lostItem,
          foundItem,
          score: result.score,
          reasons: result.reasons,
        };
      }
    });
  });

  // Home page
  const Home = () => {
    return (
      <div className="home-page">

        <section className="hero-section">
          <div className="hero-content">

            <p className="hero-label">
              SMART CAMPUS LOST & FOUND
            </p>

            <h1>
              Lost something?
              <br />
              We'll help you find it.
            </h1>

            <p className="hero-description">
              CampusFind connects students who have lost
              items with people who have found them. Find
              your belongings faster with smart matching.
            </p>

            <div className="hero-buttons">
              <button
                onClick={() => setPage("lost")}
                className="primary-button"
              >
                I Lost Something
              </button>

              <button
                onClick={() => setPage("found")}
                className="secondary-button"
              >
                I Found Something
              </button>
            </div>

          </div>
        </section>

        <section className="search-section">
          <button
            className="search-box"
            onClick={() => setPage("browse")}
          >
            🔍
            <span>Search lost and found items...</span>
          </button>
        </section>

        {/* Recent Reports */}
        <section className="recent-section">

          <div className="section-header">
            <div>
              <p className="section-label">
                RECENT REPORTS
              </p>

              <h2>Items recently reported</h2>
            </div>

            <button
              className="view-all-button"
              onClick={() => setPage("browse")}
            >
              View All →
            </button>
          </div>

          <div className="recent-grid">

            {recentItems.length === 0 ? (
              <p>No reports available yet.</p>
            ) : (
              recentItems.map((item) => (
                <div
                  className="report-card"
                  key={item.id}
                >

                  <div className="report-image">

                    {item.photoURL ? (
                      <img
                        src={item.photoURL}
                        alt={item.itemName}
                      />
                    ) : (
                      <div className="no-image">
                        🔍
                      </div>
                    )}

                  </div>

                  <div className="report-card-content">

                    <span
                      className={
                        item.type === "Lost"
                          ? "report-badge lost"
                          : "report-badge found"
                      }
                    >
                      {item.type}
                    </span>

                    <h3>{item.itemName}</h3>

                    <p>
                      📍 {item.location}
                    </p>

                    <p>
                      {item.description}
                    </p>

                  </div>

                </div>
              ))
            )}

          </div>

        </section>

        {/* Smart Match */}
        <section className="smart-match-section">

          <div className="smart-match-header">

            <p className="section-label">
              SMART MATCH
            </p>

            <h2>
              We don't just store reports.
              <br />
              We find connections.
            </h2>

            <p>
              Our smart matching system compares item
              descriptions, categories and locations to help
              connect lost and found reports automatically.
            </p>

            <button
              className="view-all-button"
              onClick={() => setPage("browse")}
            >
              Explore Smart Matches →
            </button>

          </div>

          <div className="smart-match-card">

            {matchLoading ? (
              <div className="match-message">
                Finding potential matches...
              </div>
            ) : bestMatch ? (

              <>
                <div className="match-top">

                  <span>
                    Potential Match
                  </span>

                  <strong>
                    {bestMatch.score}% Match
                  </strong>

                </div>

                <div className="match-items">

                  {/* Lost */}
                  <div className="match-item">

                    <div className="match-image">

                      {bestMatch.lostItem.photoURL ? (
                        <img
                          src={bestMatch.lostItem.photoURL}
                          alt={bestMatch.lostItem.itemName}
                        />
                      ) : (
                        <div className="no-image">
                          🔍
                        </div>
                      )}

                    </div>

                    <span className="report-badge lost">
                      LOST
                    </span>

                    <h3>
                      {bestMatch.lostItem.itemName}
                    </h3>

                    <p>
                      {bestMatch.lostItem.location}
                    </p>

                  </div>

                  <div className="match-arrow">
                    ↕
                  </div>

                  {/* Found */}
                  <div className="match-item">

                    <div className="match-image">

                      {bestMatch.foundItem.photoURL ? (
                        <img
                          src={bestMatch.foundItem.photoURL}
                          alt={bestMatch.foundItem.itemName}
                        />
                      ) : (
                        <div className="no-image">
                          🔍
                        </div>
                      )}

                    </div>

                    <span className="report-badge found">
                      FOUND
                    </span>

                    <h3>
                      {bestMatch.foundItem.itemName}
                    </h3>

                    <p>
                      {bestMatch.foundItem.location}
                    </p>

                  </div>

                </div>

                <div className="match-reasons">

                  {bestMatch.reasons.map(
                    (reason, index) => (
                      <span key={index}>
                        ✓ {reason}
                      </span>
                    )
                  )}

                </div>

              </>

            ) : (

              <div className="match-message">

                <h3>No match found yet</h3>

                <p>
                  Add both a lost and a found report
                  to start matching items.
                </p>

              </div>

            )}

          </div>

        </section>

      </div>
    );
  };

  return (
    <div className="app">

      {/* Navigation */}
      <nav className="navbar">

        <div
          className="logo"
          onClick={() => setPage("home")}
        >
          CampusFind
        </div>

        <div className="nav-links">

          <button
            onClick={() => setPage("home")}
          >
            Home
          </button>

          <button
            onClick={() => setPage("browse")}
          >
            Browse
          </button>

          <button
            onClick={() => {
              setPage("home");

              setTimeout(() => {
                const reportSection =
                  document.getElementById("report");

                if (reportSection) {
                  reportSection.scrollIntoView({
                    behavior: "smooth",
                  });
                }
              }, 100);
            }}
          >
            Report
          </button>

          <button
            onClick={() => setPage("dashboard")}
          >
            Dashboard
          </button>

          <button
            onClick={() => setPage("login")}
          >
            Login
          </button>

        </div>

      </nav>

      {/* Pages */}

      {page === "home" && <Home />}

      {page === "lost" && (
        <ReportLost
          onBack={() => setPage("home")}
        />
      )}

      {page === "found" && (
        <ReportFound
          onBack={() => setPage("home")}
        />
      )}

      {page === "browse" && (
        <Browse
          onBack={() => setPage("home")}
        />
      )}

      {page === "dashboard" && (
        <Dashboard
          onBack={() => setPage("home")}
        />
      )}

      {page === "login" && (
        <Login
          onBack={() => setPage("home")}
        />
      )}

    </div>
  );
}

export default App;