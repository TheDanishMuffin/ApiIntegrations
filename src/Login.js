import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);

  useEffect(() => {
    if (email) {
      setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    }
  }, [email]);

  useEffect(() => {
    if (password) {
      setIsValidPassword(password.length >= 6);
    }
  }, [password]);

  const handleLogin = async () => {
    if (!isValidEmail || !isValidPassword) {
      setError('Please enter valid email and password.');
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
      />
      {!isPasswordReset && (
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          style={{ borderColor: isValidPassword ? '' : 'red' }}
        />
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
    </div>
  );
}

export default Login;
