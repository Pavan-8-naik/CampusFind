import { useState } from "react";

function ReportFound({ onBack }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="report-page">
        <div className="success-card">
          <div className="success-circle">✓</div>

          <h1>Found item reported!</h1>

          <p>
            Thank you for helping your campus community.
            CampusFind will look for someone who reported this item as lost.
          </p>

          <div className="success-actions">
            <button
              className="primary-btn"
              onClick={() => setSubmitted(false)}
            >
              Report Another Item
            </button>

            <button className="secondary-btn" onClick={onBack}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="report-page">

      <div className="report-topbar">
        <button className="back-btn" onClick={onBack}>
          ← Back to CampusFind
        </button>

        <div className="report-logo">
          Campus<span>Find</span>
        </div>
      </div>

      <div className="report-wrapper">

        <div className="report-heading">
          <div className="report-icon">🤝</div>

          <div>
            <p className="small-title">FOUND SOMETHING?</p>

            <h1>Report a found item</h1>

            <p>
              Found something on campus? Tell us about it and
              we'll try to connect it with its owner.
            </p>
          </div>
        </div>

        <form className="modern-form" onSubmit={handleSubmit}>

          {/* Item Information */}
          <div className="form-section">

            <div className="form-section-title">
              <span>01</span>

              <div>
                <h2>Item information</h2>
                <p>Tell us about the item you found.</p>
              </div>
            </div>

            <div className="form-grid">

              <div className="input-group">
                <label>Item name</label>

                <input
                  type="text"
                  placeholder="e.g. Black Wallet"
                  required
                />
              </div>

              <div className="input-group">
                <label>Category</label>

                <select required>
                  <option value="">
                    Choose category
                  </option>

                  <option>Electronics</option>
                  <option>Wallet & Money</option>
                  <option>Keys</option>
                  <option>Books</option>
                  <option>Bags</option>
                  <option>Clothing</option>
                  <option>Accessories</option>
                  <option>Other</option>
                </select>
              </div>

            </div>

            <div className="input-group">
              <label>Description</label>

              <textarea
                rows="5"
                placeholder="Describe the item. Mention color, brand, unique marks, stickers, scratches, etc."
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="form-section">

            <div className="form-section-title">
              <span>02</span>

              <div>
                <h2>When & where?</h2>
                <p>
                  Tell us where and when you found the item.
                </p>
              </div>
            </div>

            <div className="form-grid">

              <div className="input-group">
                <label>Date found</label>

                <input
                  type="date"
                  required
                />
              </div>

              <div className="input-group">
                <label>Location found</label>

                <input
                  type="text"
                  placeholder="e.g. Block A / Library"
                  required
                />
              </div>

            </div>
          </div>

          {/* Photo */}
          <div className="form-section">

            <div className="form-section-title">
              <span>03</span>

              <div>
                <h2>Add a photo</h2>
                <p>
                  A photo helps the owner identify their item.
                </p>
              </div>
            </div>

            <label className="upload-box">

              <div className="upload-icon">
                📷
              </div>

              <strong>
                Click to upload an image
              </strong>

              <span>
                PNG, JPG or JPEG • Max 5MB
              </span>

              <input
                type="file"
                accept="image/*"
              />

            </label>
          </div>

          {/* Contact */}
          <div className="form-section">

            <div className="form-section-title">
              <span>04</span>

              <div>
                <h2>Contact information</h2>
                <p>
                  So the owner can contact you about the item.
                </p>
              </div>
            </div>

            <div className="input-group">
              <label>Email or phone number</label>

              <input
                type="text"
                placeholder="e.g. pavan@example.com"
                required
              />
            </div>

          </div>

          {/* Submit */}
          <div className="form-submit">

            <div>
              <strong>Help return this item</strong>

              <p>
                We'll automatically search for matching lost reports.
              </p>
            </div>

            <button
              type="submit"
              className="submit-large"
            >
              Submit Found Item →
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default ReportFound;