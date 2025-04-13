import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Review.module.css';

function ReviewHistory() {
  const history = JSON.parse(localStorage.getItem('reviewHistory')) || [];

  return (
    <div className={styles.reviewContainer}>
      <h2 className={styles.header}>📅 Review History</h2>

      {history.length === 0 ? (
        <p>No review sessions yet.</p>
      ) : (
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Score</th>
              <th>Correct</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, i) => (
              <tr key={i}>
                <td>{item.date}</td>
                <td>{item.score}%</td>
                <td>{item.correct}</td>
                <td>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to="/" className={styles.backHome}>🏠 Back to Home</Link>
    </div>
  );
}

export default ReviewHistory;
