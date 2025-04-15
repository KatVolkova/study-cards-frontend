import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.landingTitle}>Welcome to Study Cards!</h1>

      {!token && (
        <section className={styles.landing}>
          <h2 className={styles.tagline}>Boost Your Memory with StudyCards</h2>
          <p className={styles.description}>
            StudyCards helps you master any topic using proven memory techniques like spaced repetition.
            Create decks, review them daily, and track your learning journey.
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

        <h3>🧠 Why it helps?</h3>
        <p>
          It uses spaced repetition – a learning technique backed by neuroscience – to help information move from short-term to long-term memory.
        </p>

        <h3>⚙️ How It Works</h3>
        <ul className={styles.stepsList}>
          <li>✏️ Create flashcards</li>
          <li>🔁 Review with smart tracking</li>
          <li>🏆 Master topics over time</li>
        </ul>
      </section>
    </div>
  );
}

export default Home;
