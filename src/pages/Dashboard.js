import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';

function Dashboard() {
  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.landingTitle}>Your StudyCards Dashboard</h1>
      <div className={styles.dashboardButtons}>
      <Link to="/flashcards/create" className={styles.createBtn}>
        + Create Flashcard
      </Link>
      <Link to="/flashcards/" className={styles.listBtn}>
      📂 View All Flashcards
      </Link>


      <Link to="/flashcards/review" className={styles.reviewButton}>
        🔁 Review Flashcards
      </Link>

      <Link to="/flashcards/history-server" className={styles.historyBtn}>
        📡 View Server History
      </Link>
      </div>
    </div>
  );
}

export default Dashboard;
