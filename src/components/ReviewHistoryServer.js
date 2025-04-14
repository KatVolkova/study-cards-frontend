
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/Review.module.css';

function ReviewHistoryServer() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchServerHistory = async (url = `${process.env.REACT_APP_API_URL}/api/review-history/`) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Token ${token}` },
      });
      setHistory(res.data.results);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
      setTotalCount(res.data.count);
    } catch (err) {
      console.error("Failed to fetch review history:", err);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchServerHistory();
  }, []);

  const bestScore = history.reduce((max, item) => {
    return item.score > max ? item.score : max;
  }, 0);

  const longestStreak = history.reduce((max, item) => {
    return item.streak > max ? item.streak : max;
  }, 0);
  

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
      {history.length > 0 && (
      <div className={styles.statsBar}>
        <p>🏆 Best Score: <strong>{bestScore}%</strong></p>
        <p>🔥 Longest Streak: <strong>{longestStreak}</strong></p>
        <p>Total review sessions: <strong>{totalCount}</strong></p>

      </div>
    )}


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
      <div className={styles.paginationButtons}>
  <button onClick={() => fetchServerHistory(prevPage)} disabled={!prevPage}>
    ◀️ Previous
  </button>
  <button onClick={() => fetchServerHistory(nextPage)} disabled={!nextPage}>
    Next ▶️
  </button>
</div>
      <Link to="/" className={styles.backHome}>🏠 Back to Home</Link>
    </div>
  );
}

export default ReviewHistoryServer;
