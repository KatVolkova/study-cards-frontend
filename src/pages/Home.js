import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';


function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className={styles.homeContainer}>
      <h1>Welcome to Study Cards Home Page</h1>

      {token && (
        <>
        <Link to="/flashcards/create" className={styles.createBtn}>
          + Create Flashcard
        </Link>
        
        <Link to="/flashcards/review" className={styles.reviewButton}>
            🔁 Review Flashcards
          </Link>

          <Link to="/flashcards/history" className={styles.historyBtn}>
            📅 View Review History
          
          </Link>

          <Link to="/flashcards/history-server" className={styles.historyBtn}>
          📡 View Server History
          </Link>


        </>
      )}
    </div>
  );
}

export default Home;


