
import React, { useState } from 'react';

interface SignupFormProps {
  onSignup: () => void;
  onNavigateToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onNavigateToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (username.length < 5) {
      setError("Username must be at least 5 characters long");
      return;
    }
    if (username.includes(' ')) {
      setError("Username cannot contain spaces");
      return;
    }
    if (password.length < 5) {
      setError("Password must be at least 5 characters long");
      return;
    }
    if (password.includes(' ')) {
      setError("Password cannot contain spaces");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onSignup();
      } else {
        setError(data.detail || "Signup failed");
      }
    } catch (err) {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-100 p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl relative transition-all duration-500">

        <div className="mb-8 flex flex-col items-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-center leading-tight text-gray-900">
            Object <span className="text-[#116dff]">Detector</span>
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">Join the Platform</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold tracking-wide text-center rounded-lg animate-in fade-in duration-300">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-3 bg-green-50 border border-green-100 text-green-600 text-xs font-bold tracking-wide text-center rounded-lg animate-in fade-in duration-300">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-xl focus:outline-none focus:border-[#116dff] focus:ring-2 focus:ring-blue-50 transition-all font-medium"
              placeholder="Choose a username"
              disabled={loading}
            />
          </div>

          <div className="relative">
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 pr-12 rounded-xl focus:outline-none focus:border-[#116dff] focus:ring-2 focus:ring-blue-50 transition-all font-medium"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#116dff] transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88L4.62 4.62M1 1l22 22M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zM15 12a3 3 0 1 1-6 0" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 pr-12 rounded-xl focus:outline-none focus:border-[#116dff] focus:ring-2 focus:ring-blue-50 transition-all font-medium"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#116dff] transition-colors"
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88L4.62 4.62M1 1l22 22M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zM15 12a3 3 0 1 1-6 0" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#116dff] text-white font-bold text-sm uppercase tracking-widest py-4 mt-4 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/30"
          >
            {loading ? 'Creating Account...' : 'Signup'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-sm font-medium">
            Already have an account?{' '}
            <button
              onClick={onNavigateToLogin}
              className="text-[#116dff] font-bold hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
