import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

function Dashboard({ onBack }) {
  const [items, setItems] = useState([]);
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

  const recentItems = [...items]
    .sort((a, b) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Track campus lost and found reports.</p>
          </div>

          {onBack && (
            <button onClick={onBack} className="back-button">
              ← Back
            </button>
          )}
        </div>

        {loading ? (
          <div className="dashboard-loading">
            Loading dashboard...
          </div>
        ) : (
          <>
            <div className="dashboard-stats">

              <div className="stat-card">
                <div className="stat-number">
                  {totalItems}
                </div>
                <div className="stat-label">
                  Total Reports
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-number">
                  {lostItems}
                </div>
                <div className="stat-label">
                  Lost Items
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-number">
                  {foundItems}
                </div>
                <div className="stat-label">
                  Found Items
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-number">
                  {matchedItems}
                </div>
                <div className="stat-label">
                  Potential Matches
                </div>
              </div>

            </div>

            <div className="dashboard-section">
              <div className="section-heading">
                <h2>Recent Reports</h2>
              </div>

              {recentItems.length === 0 ? (
                <p>No reports available yet.</p>
              ) : (
                <div className="dashboard-reports">

                  {recentItems.map((item) => (
                    <div
                      className="dashboard-report-card"
                      key={item.id}
                    >

                      <div className="dashboard-report-image">
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

                      <div className="dashboard-report-info">

                        <span
                          className={
                            item.type === "Lost"
                              ? "report-type lost"
                              : "report-type found"
                          }
                        >
                          {item.type}
                        </span>

                        <h3>
                          {item.itemName}
                        </h3>

                        <p>
                          📍 {item.location}
                        </p>

                        <p>
                          {item.description}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Dashboard;