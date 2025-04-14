
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/Review.module.css';

function ReviewHistoryServer() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServerHistory = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/review-history/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch review history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServerHistory();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Loading review history...</p>
      </div>
    );
  }

  return (
    <div className={styles.reviewContainer}>
      <h2 className={styles.header}>📊 Your Review History (from server)</h2>

      {history.length === 0 ? (
        <p>No review sessions found.</p>
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
            {history.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.date).toLocaleString()}</td>
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

export default ReviewHistoryServer;
