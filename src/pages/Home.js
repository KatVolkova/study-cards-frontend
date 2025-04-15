import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';

function LandingSection() {
  return (
    <div className={styles.landing}>
      <h2 className={styles.tagline}>Boost Your Memory with StudyCards</h2>
      <p className={styles.description}>
        StudyCards helps you master any topic with spaced repetition flashcards.
        Create your own decks, review them daily, and track your progress.
      </p>

      <div className={styles.authLinks}>
        <Link to="/register" className={styles.getStartedBtn}>
          🚀 Get Started
        </Link>
        <Link to="/login" className={styles.loginLink}>
          Already have an account? Log In →
        </Link>
      </div>
    </div>
  );
}
function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.landingTitle}>Welcome to Study Cards</h1>

      {!token && <LandingSection />}

      {token && (
        <>
        <Link to="/flashcards/create" className={styles.createBtn}>
          + Create Flashcard
        </Link>
        
        <Link to="/flashcards/review" className={styles.reviewButton}>
            🔁 Review Flashcards
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


