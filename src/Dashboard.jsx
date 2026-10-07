import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

function Dashboard({ onBack }) {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "items"),
      (snapshot) => {
        const firestoreItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setItems(firestoreItems);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading dashboard data:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const totalItems = items.length;

  const lostItems = items.filter(
    (item) => item.type === "Lost"
  ).length;

  const foundItems = items.filter(
    (item) => item.type === "Found"
  ).length;

  const matchedItems = Math.min(lostItems, foundItems);

  const getReportStatus = (item) => {
    if (item.type === "Found") {
      return "Found";
    }

    return "Searching";
  };

  const getStatusClass = (item) => {
    if (item.type === "Found") {
      return "returned";
    }

    return "searching";
  };

  const formatDate = (item) => {
    if (item.date) {
      return item.date;
    }

    if (item.createdAt?.seconds) {
      return new Date(
        item.createdAt.seconds * 1000
      ).toLocaleDateString();
    }

    return "Recently";
  };

  const filteredReports =
    activeTab === "All"
      ? items
      : items.filter((item) => item.type === activeTab);

  const sortedReports = [...filteredReports].sort((a, b) => {
    const dateA = a.createdAt?.seconds || 0;
    const dateB = b.createdAt?.seconds || 0;

    return dateB - dateA;
  });

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
                  <strong>
                    {totalItems}
                  </strong>

                  <span>
                    Total Reports
                  </span>
                </div>
              </div>


              <div className="stat-card">
                <div className="stat-icon orange">
                  🔍
                </div>

                <div>
                  <strong>
                    {lostItems}
                  </strong>

                  <span>
                    Still Searching
                  </span>
                </div>
              </div>


              <div className="stat-card">
                <div className="stat-icon green">
                  ✓
                </div>

                <div>
                  <strong>
                    {foundItems}
                  </strong>

                  <span>
                    Items Found
                  </span>
                </div>
              </div>


              <div className="stat-card">
                <div className="stat-icon blue">
                  ✨
                </div>

                <div>
                  <strong>
                    {matchedItems}
                  </strong>

                  <span>
                    Potential Matches
                  </span>
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
                    View your submitted reports.
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

                    <div
                      className="dashboard-report"
                      key={item.id}
                    >

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


                      {/* VIEW */}
                      <button
                        className="report-view-btn"
                        onClick={() =>
                          alert(
                            `${item.itemName}\n\n${item.description || "No description available."}`
                          )
                        }
                      >
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
                  CampusFind detects similar items based on
                  category, description and location.
                </p>

              </div>

              <button
                className="secondary-btn"
                onClick={() =>
                  alert(
                    "Smart Match results are available on the CampusFind home page."
                  )
                }
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