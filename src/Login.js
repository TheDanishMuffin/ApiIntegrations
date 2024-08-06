import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    if (email) {
      setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    }
  }, [email]);

  useEffect(() => {
    if (password) {
      setIsValidPassword(password.length >= 6);
      if (password.length < 6) {
        setPasswordStrength('Weak');
      } else if (password.length < 10) {
        setPasswordStrength('Moderate');
      } else {
        setPasswordStrength('Strong');
      }
    }
  }, [password]);

  useEffect(() => {
    if (isRegister && confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    }
  }, [password, confirmPassword, isRegister]);

  const handleLogin = async () => {
    if (!isValidEmail || !isValidPassword || (isRegister && !passwordMatch)) {
      setError('Please ensure all fields are valid.');
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = isRegister
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
      setError('');
    } catch (error) {
      setError("Error during login/register: " + error.message);
    }
    setIsLoading(false);
  };

  const handlePasswordReset = async () => {
    if (!isValidEmail) {
      setError('Please enter a valid email.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setError('Password reset email sent.');
    } catch (error) {
      setError("Error sending password reset email: " + error.message);
    }
  };

  return (
    <div>
      <h2>{isRegister ? "Register" : "Login"}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        style={{ borderColor: isValidEmail ? '' : 'red' }}
        title="Enter your email address"
      />
      {!isPasswordReset && (
        <div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            style={{ borderColor: isValidPassword ? '' : 'red' }}
            title="Enter your password (min 6 characters)"
          />
          {isRegister && (
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              style={{ borderColor: passwordMatch ? '' : 'red' }}
              title="Confirm your password"
            />
          )}
          <button onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
          <p>Password strength: {passwordStrength}</p>
          {!passwordMatch && isRegister && <p style={{ color: 'red' }}>Passwords do not match</p>}
        </div>
      )}
      {!isPasswordReset ? (
        <button onClick={handleLogin} disabled={isLoading}>
          {isLoading ? 'Please wait...' : isRegister ? "Register" : "Login"}
        </button>
      ) : (
        <button onClick={handlePasswordReset} disabled={isLoading}>
          {isLoading ? 'Please wait...' : 'Reset Password'}
        </button>
      )}
      <button onClick={() => setIsRegister(!isRegister)} disabled={isLoading}>
        {isRegister ? "Switch to Login" : "Switch to Register"}
      </button>
      {!isPasswordReset && (
        <button onClick={() => setIsPasswordReset(true)} disabled={isLoading}>
          Forgot Password?
        </button>
      )}
      {isPasswordReset && (
        <button onClick={() => setIsPasswordReset(false)} disabled={isLoading}>
          Back to Login
        </button>
      )}
      {isLoading && <p>Loading...</p>}
      <p style={{ marginTop: '10px' }}>
        {isRegister
          ? "Already have an account? Switch to login."
          : "Don't have an account? Register now."}
      </p>
      <div className="password-rules">
        <h3>Password Rules</h3>
        <ul>
          <li>It Must be at least 6 characters long</li>
          <li>It Must contain at least one uppercase letter</li>
          <li>It Must contain at least one number</li>
          <li>It Must contain at least one special character</li>
        </ul>
      </div>
      <div className="tooltip-container">
        <span className="tooltip">Hover over me!!!
          <span className="tooltip-text">Tooltip text goes here</span>
        </span>
      </div>
      <div className="email-validation">
        {!isValidEmail && email && <p style={{ color: 'red' }}>Please enter a valid email address.</p>}
      </div>
      <div className="password-validation">
        {!isValidPassword && password && <p style={{ color: 'red' }}>Password must be at least 6 characters long.</p>}
      </div>
    </div>
  );
}

export default Login;
