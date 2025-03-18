import React, { useState } from 'react';
import './registerPanel.css';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPanel = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== repeatPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      const data = await response.text();
      const userId = data;

      // Creating cart for newly registered user
      const transactionResponse = await fetch(`http://localhost:8080/api/transaction/create/${userId}`, {
        method: 'POST'
      });

      if (!transactionResponse.ok) {
        const errorData = await transactionResponse.json();
        throw new Error(errorData.message || 'Failed to create transaction');
      }
      
      setSuccess("User registered, you will be transfered to login page.");
      // Redirect to login after a delay
      setTimeout(() => {
        window.location.href = '/login'; // or use navigation library like react-router-dom
      }, 3000); // 3000 milliseconds (3 seconds) delay before redirect
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='register'>
      <div className='register-panel'>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            id="repeatPassword"
            name="repeatPassword"
            placeholder="Repeat password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <p>Already have an account? <span className="register-panel__login-option bolder"><Link to='/'>Log in</Link></span></p>
      </div>
    </div>
  );
}

export default RegisterPanel;

