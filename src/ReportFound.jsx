import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

function ReportFound({ onBack }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const itemName = formData.get("itemName");
    const category = formData.get("category");
    const description = formData.get("description");
    const dateFound = formData.get("dateFound");
    const locationFound = formData.get("locationFound");
    const contact = formData.get("contact");
    const photo = formData.get("photo");

    try {
      setLoading(true);

      let photoURL = "";

      // =========================
      // UPLOAD IMAGE TO CLOUDINARY
      // =========================

      if (photo && photo.size > 0) {
        if (photo.size > 5 * 1024 * 1024) {
          throw new Error("Photo must be smaller than 5MB.");
        }

        if (!photo.type.startsWith("image/")) {
          throw new Error("Please select a valid image.");
        }

        const cloudinaryData = new FormData();

        cloudinaryData.append("file", photo);
        cloudinaryData.append(
          "upload_preset",
          "campusfind"
        );

        const cloudinaryResponse = await fetch(
          "https://api.cloudinary.com/v1_1/rbrkyj9o/image/upload",
          {
            method: "POST",
            body: cloudinaryData,
          }
        );

        if (!cloudinaryResponse.ok) {
          throw new Error(
            "Image upload failed. Please try again."
          );
        }

        const cloudinaryResult =
          await cloudinaryResponse.json();

        photoURL = cloudinaryResult.secure_url;
      }

      // =========================
      // SAVE TO FIRESTORE
      // =========================

      await addDoc(
        collection(db, "items"),
        {
          type: "Found",

          itemName: itemName,

          category: category,

          description: description,

          date: dateFound,

          location: locationFound,

          contact: contact,

          photoURL: photoURL,

          createdAt: serverTimestamp(),
        }
      );

      // Show success screen
      setSubmitted(true);

      // Clear form
      form.reset();

    } catch (err) {
      console.error(
        "Error submitting found item:",
        err
      );

      setError(
        err.message ||
        "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SUCCESS SCREEN
  // =========================

  if (submitted) {
    return (
      <div className="report-page">

        <div className="success-card">

          <div className="success-circle">
            ✓
          </div>

          <h1>
            Found item reported!
          </h1>

          <p>
            Your found item has been successfully
            reported. CampusFind will help connect
            it with its owner.
          </p>

          <div className="success-actions">

            <button
              className="primary-btn"
              onClick={() => {
                setSubmitted(false);
                setError("");
              }}
            >
              Submit Another
            </button>

            <button
              className="secondary-btn"
              onClick={onBack}
            >
              Back to Home
            </button>

          </div>

        </div>

      </div>
    );
  }

  // =========================
  // REPORT FOUND FORM
  // =========================

  return (
    <div className="report-page">

      {/* TOP BAR */}

      <div className="report-topbar">

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

      {/* MAIN FORM */}

      <div className="report-wrapper">

        {/* HEADING */}

        <div className="report-heading">

          <div className="report-icon">
            🎒
          </div>

          <div>

            <p className="small-title">
              FOUND SOMETHING?
            </p>

            <h1>
              Report a found item
            </h1>

            <p>
              Give us a few details and we'll help
              reconnect this item with its owner.
            </p>

          </div>

        </div>

        <form
          className="modern-form"
          onSubmit={handleSubmit}
        >

          {/* ========================= */}
          {/* SECTION 01 */}
          {/* ========================= */}

          <div className="form-section">

            <div className="form-section-title">

              <span>
                01
              </span>

              <div>

                <h2>
                  Item information
                </h2>

                <p>
                  Tell us about the item you found.
                </p>

              </div>

            </div>

            <div className="form-grid">

              <div className="input-group">

                <label>
                  Item name
                </label>

                <input
                  type="text"
                  name="itemName"
                  placeholder="e.g. Black iPhone 15"
                  required
                />

              </div>

              <div className="input-group">

                <label>
                  Category
                </label>

                <select
                  name="category"
                  required
                >

                  <option value="">
                    Choose category
                  </option>

                  <option>
                    Electronics
                  </option>

                  <option>
                    Wallet & Money
                  </option>

                  <option>
                    Keys
                  </option>

                  <option>
                    Books
                  </option>

                  <option>
                    Bags
                  </option>

                  <option>
                    Clothing
                  </option>

                  <option>
                    Accessories
                  </option>

                  <option>
                    Other
                  </option>

                </select>

              </div>

            </div>

            <div className="input-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                rows="5"
                placeholder="Describe the item in detail. Mention color, brand, unique marks, stickers, scratches, etc."
                required
              />

            </div>

          </div>

          {/* ========================= */}
          {/* SECTION 02 */}
          {/* ========================= */}

          <div className="form-section">

            <div className="form-section-title">

              <span>
                02
              </span>

              <div>

                <h2>
                  When & where?
                </h2>

                <p>
                  Help us identify where the item
                  was found.
                </p>

              </div>

            </div>

            <div className="form-grid">

              <div className="input-group">

                <label>
                  Date found
                </label>

                <input
                  type="date"
                  name="dateFound"
                  required
                />

              </div>

              <div className="input-group">

                <label>
                  Location found
                </label>

                <input
                  type="text"
                  name="locationFound"
                  placeholder="e.g. Central Library"
                  required
                />

              </div>

            </div>

          </div>

          {/* ========================= */}
          {/* SECTION 03 */}
          {/* ========================= */}

          <div className="form-section">

            <div className="form-section-title">

              <span>
                03
              </span>

              <div>

                <h2>
                  Add a photo
                </h2>

                <p>
                  A photo makes it much easier
                  for the owner to identify the item.
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
                name="photo"
                accept="image/*"
              />

            </label>

          </div>

          {/* ========================= */}
          {/* SECTION 04 */}
          {/* ========================= */}

          <div className="form-section">

            <div className="form-section-title">

              <span>
                04
              </span>

              <div>

                <h2>
                  Contact information
                </h2>

                <p>
                  So the owner can contact you
                  about their item.
                </p>

              </div>

            </div>

            <div className="input-group">

              <label>
                Email or phone number
              </label>

              <input
                type="text"
                name="contact"
                placeholder="e.g. student@example.com"
                required
              />

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* SUBMIT */}

          <div className="form-submit">

            <div>

              <strong>
                Ready to report?
              </strong>

              <p>
                We'll automatically make this
                found item visible to people
                searching for their belongings.
              </p>

            </div>

            <button
              type="submit"
              className="submit-large"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Found Item →"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ReportFound;