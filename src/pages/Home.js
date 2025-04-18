import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.landingTitle}>Boost Your Memory with StudyCards</h1>

      {!token && (
        <section className={styles.landing}>
          <p className={styles.description}>
          StudyCards helps you learn and remember important information more easily. 
          Organize your notes into flashcards, practice regularly, and watch your knowledge grow.
          </p>

          <div className={styles.authLinks}>
            <Link to="/register" className={styles.getStartedBtn}>
              🚀 Get Started
            </Link>
            <Link to="/login" className={styles.loginLink}>
              Already have an account? Log In →
            </Link>
          </div>
        </section>
      )}

      {/* Show About + Steps to all users */}
      <section className={styles.infoSection}>
        <h3>📚 What is StudyCards?</h3>
        <p>
          StudyCards is a web app that helps you memorize and retain information more effectively using digital flashcards.
        </p>

        <h3>⚙️ How It Works</h3>
        <ol className={styles.stepsList}>
          <li> Create flashcards</li>
          <li> Review and track your progress</li>
          <li> Master topics over time</li>
        </ol>
      </section>
    </div>
  );
}

export default Home;
