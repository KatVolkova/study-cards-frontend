
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/AuthForm.module.css';

function Login() {
  // Initialize state with username, email, and password
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Destructure formData for ease of use
  const { username, email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage('');

    try {
      // Send login data. 
      // Your back end must be prepared to look at both username and email for authentication.
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login/`,
        formData
      );
      setSuccessMessage("Login successful!");
      console.log("Login successful!");
      navigate("/"); // Redirect to home page after successful login
    } catch (error) {
      console.error("Login error:", error);
      const errorMessages = [];

      // If the server responded with errors, consolidate them
      if (error.response) {
        const statusCode = error.response.status;
        const data = error.response.data;

        if (statusCode === 400 || statusCode === 401) {
          if (typeof data === "object" && data !== null) {
            for (const key in data) {
              if (Object.prototype.hasOwnProperty.call(data, key)) {
                const fieldValue = data[key];
                if (Array.isArray(fieldValue)) {
                  fieldValue.forEach((msg) => {
                    errorMessages.push(`${key}: ${msg}`);
                  });
                } else if (typeof fieldValue === "string") {
                  errorMessages.push(`${key}: ${fieldValue}`);
                } else {
                  errorMessages.push(`${key}: ${JSON.stringify(fieldValue)}`);
                }
              }
            }
          } else {
            errorMessages.push("Bad Request: " + JSON.stringify(data));
          }
        } else if (statusCode === 500) {
          errorMessages.push("Server error (500). Please try again later or contact support.");
        } else {
          errorMessages.push(`Error ${statusCode}: ${JSON.stringify(data) || "Unexpected error"}`);
        }
      } else if (error.request) {
        errorMessages.push("No response from server. Check your network.");
      } else {
        errorMessages.push("Unexpected error: " + error.message);
      }

      setErrors(errorMessages);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Login</h2>

      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}

      {errors.length > 0 && (
        <div className={styles.errorContainer}>
          <ul className={styles.errorList}>
            {errors.map((err, index) => (
              <li key={index} className={styles.alertBox}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formInput}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formInput}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formInput}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </div>
        <button type="submit" className={styles.formButton}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
