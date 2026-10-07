import { useState } from "react";

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
      ? reports
      : reports.filter((report) => report.type === activeTab);

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

              <div className="dashboard-report" key={report.id}>

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

                <button className="report-view-btn">
                  View →
                </button>

              </div>

            ))}

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

      </div>

    </div>
  );
}

export default Dashboard;