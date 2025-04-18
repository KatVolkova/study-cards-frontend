import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';

function Dashboard() {
  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.landingTitle}>Your StudyCards Dashboard</h1>
      <div className={styles.dashboardButtons}>
      <Link to="/flashcards/create" className={styles.createBtn}>
      <i className="fas fa-plus me-2"></i> Create Flashcard
      </Link>
      <Link to="/flashcards/" className={styles.listBtn}>
      <i className="fas fa-folder-open me-2"></i> View All Flashcards
      </Link>


      <Link to="/flashcards/review" className={styles.reviewButton}>
      <i className="fas fa-sync-alt me-2"></i> Review Flashcards
      </Link>

      <Link to="/flashcards/history-server" className={styles.historyBtn}>
      <i className="fas fa-history me-2"></i> View Server History
      </Link>
      </div>
    </div>
  );
}

export default Dashboard;
