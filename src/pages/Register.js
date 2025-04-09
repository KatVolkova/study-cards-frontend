import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/AuthForm.module.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/registration/`,
        formData
      );
      setSuccessMessage("Registration successful!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessages = [];

      // If the server responded with an error status
      if (error.response) {
        const statusCode = error.response.status;
        const data = error.response.data;

        if (statusCode === 400) {
          // Typically, field validation errors or other client-side issues
          if (typeof data === "object" && data !== null) {
            // Gather error messages from each field
            for (const key in data) {
              if (Object.prototype.hasOwnProperty.call(data, key)) {
                const fieldValue = data[key];
                if (Array.isArray(fieldValue)) {
                  // e.g., "username": ["This field is required"]
                  fieldValue.forEach((msg) => {
                    errorMessages.push(`${key}: ${msg}`);
                  });
                } else if (typeof fieldValue === "string") {
                  // e.g., "username": "This field is required"
                  errorMessages.push(`${key}: ${fieldValue}`);
                } else {
                  // fallback for unexpected types
                  errorMessages.push(`${key}: ${JSON.stringify(fieldValue)}`);
                }
              }
            }
          } else {
            // If the response data is not an object, just push it as a string
            errorMessages.push("Bad Request: " + JSON.stringify(data));
          }
        } else if (statusCode === 500) {
          // Internal server error
          errorMessages.push(
            "Server error (500). Please try again later or contact support."
          );
        } else {
          // Other status codes (401, 403, 404, etc.)
          errorMessages.push(
            `Error ${statusCode}: ${JSON.stringify(data) || "Unexpected error"}`
          );
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessages.push("No response from server. Check your network.");
      } else {
        // Something else triggered an error
        errorMessages.push("Unexpected error: " + error.message);
      }

      setErrors(errorMessages);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Registration Form</h2>

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
            value={formData.username}
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
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formInput}>
          <input
            type="password"
            name="password1"
            placeholder="Password"
            value={formData.password1}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formInput}>
          <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            value={formData.password2}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </div>
        <button type="submit" className={styles.formButton}>
          Submit
        </button>
      </form>

      <div className={styles.formSubtitle}>
        <h3>Password Requirements:</h3>
        <ul>
          <li>At least 8 characters long</li>
          <li>Include both uppercase and lowercase letters</li>
          <li>Include at least one number</li>
          <li>Special characters are allowed</li>
        </ul>
      </div>
    </div>
  );
}

export default Register;