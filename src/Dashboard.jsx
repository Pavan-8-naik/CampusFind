import { useState } from "react";

function Dashboard({ onBack }) {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  const reports = [
    {
      id: 1,
      name: "Black Wallet",
      type: "Lost",
      status: "Searching",
      location: "Central Library",
      date: "Today",
      icon: "👛",
    },
    {
      id: 2,
      name: "iPhone 15",
      type: "Lost",
      status: "Potential Match",
      location: "Block A",
      date: "Yesterday",
      icon: "📱",
    },
    {
      id: 3,
      name: "Blue Notebook",
      type: "Found",
      status: "Returned",
      location: "Library",
      date: "2 days ago",
      icon: "📓",
    },
  ];

  const filteredReports =
    activeTab === "All"
      ? items
      : items.filter((item) => item.type === activeTab);

  const sortedReports = [...filteredReports].sort((a, b) => {
    const dateA = a.createdAt?.seconds || 0;
    const dateB = b.createdAt?.seconds || 0;

    return dateB - dateA;
  });

  /* DASHBOARD STATISTICS */

  const totalReports = reports.length;

  const searchingReports = reports.filter(
    (report) => report.status === "Searching"
  ).length;

  const returnedReports = reports.filter(
    (report) => report.status === "Returned"
  ).length;

  const potentialMatches = reports.filter(
    (report) => report.status === "Potential Match"
  ).length;

  /* SMART MATCH CALCULATION */

  const lostReports = reports.filter((report) => report.type === "Lost");

  const foundReports = reports.filter((report) => report.type === "Found");

  const calculateMatch = (lost, found) => {
    let score = 0;

    if (
      lost.name.toLowerCase().trim() ===
      found.name.toLowerCase().trim()
    ) {
      score += 40;
    }

    if (
      lost.category.toLowerCase() ===
      found.category.toLowerCase()
    ) {
      score += 25;
    }

    if (
      lost.location.toLowerCase() ===
      found.location.toLowerCase()
    ) {
      score += 20;
    }

    const lostWords = lost.description.toLowerCase().split(" ");
    const foundWords = found.description.toLowerCase().split(" ");

    const commonWords = lostWords.filter((word) =>
      foundWords.includes(word)
    );

    if (commonWords.length > 0) {
      score += 15;
    }

    return Math.min(score, 100);
  };

  const smartMatches = useMemo(() => {
    const matches = [];

    lostReports.forEach((lost) => {
      foundReports.forEach((found) => {
        const score = calculateMatch(lost, found);

        if (score >= 50) {
          matches.push({
            lost,
            found,
            score,
          });
        }
      });
    });

    return matches.sort((a, b) => b.score - a.score);
  }, []);

  const topMatch = smartMatches[0];

  return (
    <div className="dashboard-page">

      {/* TOP BAR */}

      <div className="dashboard-topbar">

        <button className="back-btn" onClick={onBack}>
          ← Back to CampusFind
        </button>

        <div className="report-logo">
          Campus<span>Find</span>
        </div>

      </div>

      {/* MAIN */}

      <div className="dashboard-wrapper">

        {/* HEADER */}

        <div className="dashboard-header">

          <div>

            <p className="small-title">
              MY DASHBOARD
            </p>

            <h1>
              Welcome back 👋
            </h1>

            <p>
              Track your lost and found reports in one place.
            </p>

          </div>

          <button
            className="primary-btn"
            onClick={() => alert("Report options coming next!")}
          >
            + New Report
          </button>

        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            Loading dashboard...
          </div>
        ) : (
          <>

        {/* STATS */}
        <div className="dashboard-stats">

          <div className="stat-card">
            <div className="stat-icon purple">
              📋
            </div>
            <div>
              <strong>3</strong>
              <span>Total Reports</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              🔎
            </div>
            <div>
              <strong>2</strong>
              <span>Still Searching</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              ✓
            </div>
            <div>
              <strong>1</strong>
              <span>Items Returned</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              🤝
            </div>
            <div>
              <strong>2</strong>
              <span>Potential Matches</span>
            </div>
          </div>

            </div>


        {/* REPORTS SECTION */}
        <section className="dashboard-section">

              <div className="dashboard-section-heading">

            <div>
              <h2>
                My Reports
              </h2>

              <p>
                View and manage your submitted reports.
              </p>
            </div>

                <div className="dashboard-tabs">

                  <button
                    className={
                      activeTab === "All"
                        ? "active"
                        : ""
                    }
                    onClick={() => setActiveTab("All")}
                  >
                    All
                  </button>

                  <button
                    className={
                      activeTab === "Lost"
                        ? "active"
                        : ""
                    }
                    onClick={() => setActiveTab("Lost")}
                  >
                    Lost
                  </button>

                  <button
                    className={
                      activeTab === "Found"
                        ? "active"
                        : ""
                    }
                    onClick={() => setActiveTab("Found")}
                  >
                    Found
                  </button>

                </div>

              </div>


              {/* REPORT LIST */}

              <div className="dashboard-reports">

                {sortedReports.length === 0 ? (

                  <div
                    style={{
                      padding: "30px",
                      textAlign: "center",
                      color: "#777c8d",
                    }}
                  >
                    No reports available yet.
                  </div>

                ) : (

                  sortedReports.map((item) => (

              <div className="dashboard-report" key={report.id}>

                      {/* IMAGE / ICON */}
                      <div className="dashboard-report-icon">

                        {item.photoURL ? (

                          <img
                            src={item.photoURL}
                            alt={item.itemName}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "12px",
                            }}
                          />

                        ) : (

                          item.type === "Lost"
                            ? "🔍"
                            : "📦"

                        )}

                      </div>


                      {/* REPORT INFO */}
                      <div className="dashboard-report-info">

                        <div className="dashboard-report-title">

                          <span
                            className={
                              item.type === "Lost"
                                ? "lost-badge"
                                : "found-badge"
                            }
                          >
                            {item.type.toUpperCase()}
                          </span>

                          <h3>
                            {item.itemName}
                          </h3>

                        </div>


                        <div className="dashboard-report-meta">

                          <span>
                            📍 {item.location || "Location not provided"}
                          </span>

                          <span>
                            📅 {formatDate(item)}
                          </span>

                        </div>

                      </div>


                      {/* STATUS */}
                      <div className="dashboard-status">

                        <span
                          className={`status ${getStatusClass(item)}`}
                        >
                          {getReportStatus(item)}
                        </span>

                      </div>

                <button className="report-view-btn">
                  View →
                </button>

                    </div>

                  ))

                )}

              </div>

            </section>


        {/* SMART MATCH CARD */}

        <section className="dashboard-match">

              <div className="dashboard-match-icon">
                ✨
              </div>

              <div>

                <p className="small-title">
                  SMART MATCH
                </p>

            <h2>
              We found potential matches for you
            </h2>

            <p>
              CampusFind has detected similar items based on
              category, description and location.
            </p>

              </div>

          <button
            className="secondary-btn"
            onClick={() => alert("Smart Match page coming next!")}
          >
            View Matches →
          </button>

            </section>

          </>
        )}

      </div>

    </div>
  );
}

export default Dashboard;