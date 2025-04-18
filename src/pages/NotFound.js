import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/NotFound.module.css';

function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <h1 className={styles.errorCode}>404</h1>
      <h2 className={styles.errorMessage}>Page Not Found</h2>
      <p className={styles.suggestion}>
      Sorry, the page you requested could not be found. 
      </p>
      <Link to="/" className={styles.backHomeLink}>
      <i className="fas fa-home me-2"></i> Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
