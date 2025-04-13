import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Review.module.css';

function ReviewHistory() {
  const history = JSON.parse(localStorage.getItem('reviewHistory')) || [];
  
const handleClearHistory = () => {
    const confirmClear = window.confirm("Are you sure you want to delete all review history?");
    if (confirmClear) {
      localStorage.removeItem('reviewHistory');
      window.location.reload(); // quick refresh to re-render the cleared state
    }
  };
  
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
      <div className={styles.historyActions}>
  <button onClick={handleClearHistory} className={styles.clearBtn}>
    🧹 Clear History
  </button>
  <Link to="/" className={styles.backHome}>🏠 Back to Home</Link>
</div>
    </div>
  );
}

export default ReviewHistory;
