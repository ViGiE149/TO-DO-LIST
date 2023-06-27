import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();
  const microsoftProvider = new OAuthProvider('microsoft.com');

  const handleEmailRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to '/' after successful registration
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/'); // Redirect to '/' after successful registration
    } catch (error) {
      setError(error.message);
    }
  };

  const handleMicrosoftRegister = async () => {
    try {
      await signInWithPopup(auth, microsoftProvider);
      navigate('/'); // Redirect to '/' after successful registration
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='todo-input'
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='todo-input'
      />
      <br />
      <button className="todo-button" onClick={handleEmailRegister}>
        Register with Email
      </button>
      <br />
      <button className="todo-button" onClick={handleGoogleRegister}>
        Register with Google
      </button>
      <button className="todo-button" onClick={handleMicrosoftRegister}>
        Register with Microsoft
      </button>
      {error && <p>{error}</p>}
      <p className="register-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
  
  
};

export default Register;

