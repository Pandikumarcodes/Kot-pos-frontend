// src/pages/LoginPage.tsx
import { useState } from "react";
import { Button } from "../../design-system/atoms/Button/Button";

export default function LoginPage() {
  const [showMessage, setShowMessage] = useState("");

  const handleSignIn = () => {
    setShowMessage("Navigating to Sign In page...");
    setTimeout(() => setShowMessage(""), 2000);
    // Add your navigation logic here
    // Example: navigate('/signin');
  };

  const handleSignUp = () => {
    setShowMessage("Navigating to Sign Up page...");
    setTimeout(() => setShowMessage(""), 2000);
    // Add your navigation logic here
    // Example: navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kot-primary via-kot-header to-kot-stats flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-full shadow-kot-lg mb-4">
            <svg
              className="w-12 h-12 text-kot-dark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-kot-darker mb-2">
            Welcome to KOT
          </h1>
          <p className="text-kot-text text-lg">Keep On Track with your goals</p>
        </div>

        {/* Status Message */}
        {showMessage && (
          <div className="mb-4 p-4 bg-white rounded-lg shadow-kot text-center text-kot-dark font-medium">
            {showMessage}
          </div>
        )}

        {/* Action Cards */}
        <div className="space-y-4">
          {/* Sign In Card */}
          <div className="bg-white rounded-2xl shadow-kot-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start mb-4">
              <div className="p-3 bg-kot-primary rounded-lg mr-4">
                <svg
                  className="w-6 h-6 text-kot-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-kot-darker mb-2">
                  Sign In
                </h2>
                <p className="text-kot-text">
                  Already have an account? Sign in to continue your journey.
                </p>
              </div>
            </div>
            <Button onClick={handleSignIn}>Sign In to Your Account</Button>
          </div>

          {/* Sign Up Card */}
          <div className="bg-white rounded-2xl shadow-kot-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start mb-4">
              <div className="p-3 bg-kot-stats rounded-lg mr-4">
                <svg
                  className="w-6 h-6 text-kot-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-kot-darker mb-2">
                  Sign Up
                </h2>
                <p className="text-kot-text">
                  New here? Create an account and start tracking today.
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={handleSignUp}>
              Create New Account
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 bg-white bg-opacity-60 rounded-xl p-6">
          <h3 className="text-center text-sm font-semibold text-kot-darker mb-4">
            Why Choose KOT?
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl mb-1">📊</div>
              <p className="text-xs text-kot-text">Track Progress</p>
            </div>
            <div>
              <div className="text-2xl mb-1">🎯</div>
              <p className="text-xs text-kot-text">Set Goals</p>
            </div>
            <div>
              <div className="text-2xl mb-1">✨</div>
              <p className="text-xs text-kot-text">Stay Motivated</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-kot-text">
          <p>© 2024 KOT. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <button className="hover:text-kot-dark transition-colors">
              Privacy Policy
            </button>
            <span>•</span>
            <button className="hover:text-kot-dark transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
