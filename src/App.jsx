import "./App.css";
import ReportLost from "./ReportLost";
import ReportFound from "./ReportFound";
import Browse from "./Browse";
import Dashboard from "./Dashboard";
import Login from "./Login";
import { useState } from "react";

function App() {
  const [page, setPage] = useState("home");

  // REPORT LOST
  if (page === "lost") {
    return <ReportLost onBack={() => setPage("home")} />;
  }

  // REPORT FOUND
  if (page === "found") {
    return <ReportFound onBack={() => setPage("home")} />;
  }

  // BROWSE
  if (page === "browse") {
    return <Browse onBack={() => setPage("home")} />;
  }

  // DASHBOARD
  if (page === "dashboard") {
    return <Dashboard onBack={() => setPage("home")} />;
  }

  // LOGIN
  if (page === "login") {
    return <Login onBack={() => setPage("home")} />;
  }

  // HOME
  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">

        <div
          className="logo"
          onClick={() => setPage("home")}
          style={{ cursor: "pointer" }}
        >
          Campus<span>Find</span>
        </div>

        <div className="nav-links">

          <button onClick={() => setPage("home")}>
            Home
          </button>

          <button onClick={() => setPage("browse")}>
            Browse
          </button>

          <a href="#report">
            Report
          </a>

          <button onClick={() => setPage("dashboard")}>
            Dashboard
          </button>

          <button
            className="login-btn"
            onClick={() => setPage("login")}
          >
            Login
          </button>

        </div>

      </nav>

      {/* HERO */}
      <section className="hero" id="home">

        <div className="hero-content">

          <p className="tagline">
            SMART CAMPUS LOST & FOUND
          </p>

          <h1>
            Lost something?
            <br />
            <span>We'll help you find it.</span>
          </h1>

          <p className="hero-text">
            CampusFind connects students who have lost items
            with people who have found them. Find your belongings
            faster with smart matching.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => setPage("lost")}
            >
              I Lost Something
            </button>

            <button
              className="secondary-btn"
              onClick={() => setPage("found")}
            >
              I Found Something
            </button>

          </div>

          {/* SEARCH */}
          <div className="search-box">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search for lost items..."
              onFocus={() => setPage("browse")}
            />

            <button onClick={() => setPage("browse")}>
              Search
            </button>

          </div>

        </div>

      </section>

      {/* RECENT REPORTS */}
      <section className="recent-section" id="browse">

        <div className="section-heading">

          <div>

            <p className="small-title">
              RECENT REPORTS
            </p>

            <h2>
              Items recently reported
            </h2>

          </div>

          <button
            className="view-btn"
            onClick={() => setPage("browse")}
          >
            View All →
          </button>

        </div>

        <div className="cards">

          <div className="item-card">

            <div className="item-image">
              📱
            </div>

            <div className="item-info">

              <span className="lost-badge">
                LOST
              </span>

              <h3>
                iPhone 15
              </h3>

              <p>
                📍 Library • 2 hours ago
              </p>

              <p className="description">
                Black iPhone with transparent case.
              </p>

            </div>

          </div>

          <div className="item-card">

            <div className="item-image">
              🎒
            </div>

            <div className="item-info">

              <span className="found-badge">
                FOUND
              </span>

              <h3>
                Black Backpack
              </h3>

              <p>
                📍 Block A • 5 hours ago
              </p>

              <p className="description">
                Black backpack found near classroom.
              </p>

            </div>

          </div>

          <div className="item-card">

            <div className="item-image">
              🔑
            </div>

            <div className="item-info">

              <span className="lost-badge">
                LOST
              </span>

              <h3>
                Car Keys
              </h3>

              <p>
                📍 Parking Area • Yesterday
              </p>

              <p className="description">
                Silver car keys with blue keychain.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* SMART MATCH */}
      <section className="smart-section">

        <div className="smart-content">

          <p className="small-title">
            SMART MATCH
          </p>

          <h2>
            We don't just store reports.
            <br />
            <span>We find connections.</span>
          </h2>

          <p>
            Our smart matching system compares item descriptions,
            categories and locations to help connect lost and found
            reports automatically.
          </p>

          <button
            className="primary-btn"
            onClick={() => setPage("browse")}
          >
            Explore Smart Matches →
          </button>

        </div>

        <div className="match-card">

          <div className="match-header">

            <span>
              Potential Match
            </span>

            <strong>
              92% Match
            </strong>

          </div>

          <div className="match-items">

            <div className="match-item">

              <div className="match-icon">
                👛
              </div>

              <div>

                <small>
                  LOST
                </small>

                <h3>
                  Black Wallet
                </h3>

                <p>
                  Library • Today
                </p>

              </div>

            </div>

            <div className="match-line">
              ↕
            </div>

            <div className="match-item">

              <div className="match-icon">
                👛
              </div>

              <div>

                <small>
                  FOUND
                </small>

                <h3>
                  Black Wallet
                </h3>

                <p>
                  Library • Today
                </p>

              </div>

            </div>

          </div>

          <div className="match-reasons">

            <span>
              ✓ Same category
            </span>

            <span>
              ✓ Similar description
            </span>

            <span>
              ✓ Same location
            </span>

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section
        className="how-section"
        id="report"
      >

        <div className="section-heading center">

          <p className="small-title">
            HOW IT WORKS
          </p>

          <h2>
            Find your belongings in 3 simple steps
          </h2>

        </div>

        <div className="steps">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              📝
            </div>

            <h3>
              Report
            </h3>

            <p>
              Report your lost or found item with important details.
            </p>

          </div>

          <div className="step">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              🔎
            </div>

            <h3>
              Match
            </h3>

            <p>
              CampusFind searches for similar reports automatically.
            </p>

          </div>

          <div className="step">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              🤝
            </div>

            <h3>
              Connect
            </h3>

            <p>
              Connect with the person who found or lost the item.
            </p>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer>

        <div className="footer-logo">
          Campus<span>Find</span>
        </div>

        <p>
          Making campuses smarter, safer and easier for everyone.
        </p>

        <p className="copyright">
          © 2026 CampusFind • Built for Hackathon
        </p>

      </footer>

    </div>
  );
}

export default App;