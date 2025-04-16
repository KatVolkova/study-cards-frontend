
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/Review.module.css';

function ReviewHistoryServer() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchAllReviewHistory = async () => {
    const token = localStorage.getItem('token');
    let url = `${process.env.REACT_APP_API_URL}/api/review-history/?limit=100`;
    let allResults = [];
  
    try {
      while (url) {
        const res = await axios.get(url, {
          headers: { Authorization: `Token ${token}` },
        });
        allResults = [...allResults, ...res.data.results];
        url = res.data.next;
      }
      setHistory(allResults);
      setTotalCount(allResults.length);
    } catch (err) {
      console.error("Failed to fetch full review history:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const bestScore = useMemo(() => {
    if (!history.length) return 0;
    const scores = history.map(item => parseFloat(item.score)).filter(score => !isNaN(score));
    return scores.length ? Math.max(...scores) : 0;
  }, [history]);
  

  const longestStreak = useMemo(() => {
    return history.reduce((max, item) => (item.streak > max ? item.streak : max), 0);
  }, [history]);
  

  useEffect(() => {
    fetchAllReviewHistory();
  }, []);

  useEffect(() => {
    console.log("History loaded:", history);
    console.log("Best score:", bestScore);
    console.log("Longest streak:", longestStreak);
  }, [history, bestScore, longestStreak]);

  

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
        <p>🏆 Best Score: <strong>{Number(bestScore).toFixed(2)}%</strong></p>
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
      
      <Link to="/" className={styles.backHome}>🏠 Back to Home</Link>
    </div>
  );
}

export default ReviewHistoryServer;
