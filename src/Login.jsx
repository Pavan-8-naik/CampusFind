import { useState } from "react";

function Login({ onBack }) {
  const [isSignup, setIsSignup] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="login-page">
        <div className="login-success-card">

          <div className="success-circle">✓</div>

          <h1>
            {isSignup ? "Account created!" : "Welcome back!"}
          </h1>

          <p>
            {isSignup
              ? "Your CampusFind account has been created successfully."
              : "You have successfully logged in to CampusFind."}
          </p>

          <button
            className="primary-btn"
            onClick={onBack}
          >
            Continue to CampusFind →
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="login-page">

      {/* TOP BAR */}
      <div className="login-topbar">

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

      {/* LOGIN CONTAINER */}
      <div className="login-container">

        <div className="login-card">

          {/* ICON */}
          <div className="login-icon">
            🔐
          </div>

          <p className="small-title">
            {isSignup ? "JOIN CAMPUSFIND" : "WELCOME BACK"}
          </p>

          <h1>
            {isSignup
              ? "Create your account"
              : "Sign in to CampusFind"}
          </h1>

          <p className="login-description">
            {isSignup
              ? "Create an account to report and track lost & found items."
              : "Sign in to manage your lost & found reports."}
          </p>

          {/* FORM */}
          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {isSignup && (
              <div className="input-group">

                <label>
                  Full name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Pavan Naik"
                  required
                />

              </div>
            )}

            <div className="input-group">

              <label>
                Email address
              </label>

              <input
                type="email"
                placeholder="e.g. pavan@example.com"
                required
              />

            </div>

            <div className="input-group">

              <div className="password-label">

                <label>
                  Password
                </label>

                {!isSignup && (
                  <button
                    type="button"
                    className="forgot-btn"
                  >
                    Forgot password?
                  </button>
                )}

              </div>

              <input
                type="password"
                placeholder="Enter your password"
                required
              />

            </div>

            {isSignup && (
              <div className="input-group">

                <label>
                  Confirm password
                </label>

                <input
                  type="password"
                  placeholder="Confirm your password"
                  required
                />

              </div>
            )}

            <button
              type="submit"
              className="login-submit"
            >
              {isSignup
                ? "Create Account →"
                : "Sign In →"}
            </button>

          </form>

          {/* SWITCH LOGIN / SIGNUP */}

          <div className="login-switch">

            <span>
              {isSignup
                ? "Already have an account?"
                : "Don't have an account?"}
            </span>

            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setSubmitted(false);
              }}
            >
              {isSignup
                ? "Sign In"
                : "Create Account"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;