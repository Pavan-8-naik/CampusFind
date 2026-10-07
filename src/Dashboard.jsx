import { useMemo, useState } from "react";

function Dashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState("All");

  const reports = [
    {
      id: 1,
      name: "Black Wallet",
      type: "Lost",
      status: "Searching",
      location: "Central Library",
      date: "Today",
      category: "Wallet",
      description: "Black leather wallet",
      icon: "👛",
    },
    {
      id: 2,
      name: "iPhone 15",
      type: "Lost",
      status: "Potential Match",
      location: "Block A",
      date: "Yesterday",
      category: "Electronics",
      description: "Black iPhone 15",
      icon: "📱",
    },
    {
      id: 3,
      name: "Blue Notebook",
      type: "Found",
      status: "Returned",
      location: "Library",
      date: "2 days ago",
      category: "Books",
      description: "Blue college notebook",
      icon: "📓",
    },
    {
      id: 4,
      name: "Black Wallet",
      type: "Found",
      status: "Potential Match",
      location: "Central Library",
      date: "Today",
      category: "Wallet",
      description: "Black leather wallet found near entrance",
      icon: "👛",
    },
  ];

  /* FILTER REPORTS */

  const filteredReports =
    activeTab === "All"
      ? reports
      : reports.filter((report) => report.type === activeTab);

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

        {/* STATS */}

        <div className="dashboard-stats">

          <div className="stat-card">

            <div className="stat-icon purple">
              📋
            </div>

            <div>
              <strong>{totalReports}</strong>
              <span>Total Reports</span>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon orange">
              🔎
            </div>

            <div>
              <strong>{searchingReports}</strong>
              <span>Still Searching</span>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon green">
              ✓
            </div>

            <div>
              <strong>{returnedReports}</strong>
              <span>Items Returned</span>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon blue">
              🤝
            </div>

            <div>
              <strong>{potentialMatches}</strong>
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
                className={activeTab === "All" ? "active" : ""}
                onClick={() => setActiveTab("All")}
              >
                All
              </button>

              <button
                className={activeTab === "Lost" ? "active" : ""}
                onClick={() => setActiveTab("Lost")}
              >
                Lost
              </button>

              <button
                className={activeTab === "Found" ? "active" : ""}
                onClick={() => setActiveTab("Found")}
              >
                Found
              </button>

            </div>

          </div>

          {/* REPORT LIST */}

          <div className="dashboard-reports">

            {filteredReports.map((report) => (

              <div
                className="dashboard-report"
                key={report.id}
              >

                <div className="dashboard-report-icon">
                  {report.icon}
                </div>

                <div className="dashboard-report-info">

                  <div className="dashboard-report-title">

                    <span
                      className={
                        report.type === "Lost"
                          ? "lost-badge"
                          : "found-badge"
                      }
                    >
                      {report.type.toUpperCase()}
                    </span>

                    <h3>
                      {report.name}
                    </h3>

                  </div>

                  <div className="dashboard-report-meta">

                    <span>
                      📍 {report.location}
                    </span>

                    <span>
                      🕒 {report.date}
                    </span>

                  </div>

                </div>

                <div className="dashboard-status">

                  <span
                    className={
                      report.status === "Returned"
                        ? "status returned"
                        : report.status === "Potential Match"
                        ? "status match"
                        : "status searching"
                    }
                  >
                    {report.status}
                  </span>

                </div>

                <button
                  className="report-view-btn"
                  onClick={() =>
                    alert(
                      `${report.name}\n\nType: ${report.type}\nLocation: ${report.location}\nStatus: ${report.status}`
                    )
                  }
                >
                  View →
                </button>

              </div>

            ))}

          </div>

        </section>

        {/* SMART MATCH */}

        <section className="dashboard-match">

          <div className="dashboard-match-icon">
            ✨
          </div>

          <div>

            <p className="small-title">
              SMART MATCH
            </p>

            {topMatch ? (
              <>
                <h2>
                  Potential match found — {topMatch.score}%
                </h2>

                <p>
                  <strong>{topMatch.lost.name}</strong> may match
                  the found report{" "}
                  <strong>{topMatch.found.name}</strong>.
                  Similarity is based on item name, category,
                  location and description.
                </p>
              </>
            ) : (
              <>
                <h2>
                  No strong matches found yet
                </h2>

                <p>
                  We'll compare new lost and found reports
                  automatically.
                </p>
              </>
            )}

          </div>

          <button
            className="secondary-btn"
            onClick={() => {
              if (topMatch) {
                alert(
                  `Smart Match: ${topMatch.score}%\n\n` +
                  `Lost: ${topMatch.lost.name}\n` +
                  `Found: ${topMatch.found.name}\n\n` +
                  `Matching factors:\n` +
                  `• Item name\n` +
                  `• Category\n` +
                  `• Location\n` +
                  `• Description`
                );
              } else {
                alert("No potential matches available.");
              }
            }}
          >
            View Matches →
          </button>

        </section>

      </div>

    </div>
  );
}

export default Dashboard;