import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../styles/Review.module.css';

function shuffleArray(array) {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
  
function ReviewFlashcards() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true)
  const [streak, setStreak] = useState(0);


  useEffect(() => {
    const fetchCards = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/flashcards/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setCards(shuffleArray(res.data));
        setLoading(false);
      } catch (err) {
        console.error("Failed to load flashcards:", err);
        setLoading(false);
      }
    };
    fetchCards();
  }, []);
  const handleReviewAgain = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setResults([]);
    setStreak(0);
    setCards(shuffleArray(cards));
  };
  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleAnswer = (correct) => {
    setResults((prevResults) => [
        ...prevResults,
        { id: cards[currentIndex].id, correct },
      ]);

    setStreak((prevStreak) => (correct ? prevStreak + 1 : 0));
    setShowAnswer(false);
    setCurrentIndex(currentIndex + 1);
  };
  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Loading flashcards...</p>
      </div>
    );
  }
  if (cards.length === 0) {
    return (
      <div className={styles.emptyMessage}>
        <p>No flashcards to review!</p>
        <Link to="/flashcards/create" className={styles.reviewAgain}>
          ➕ Create Your First Flashcard
        </Link>
      </div>
    );
  }
  if (currentIndex >= cards.length) {
    const correctCount = results.filter(r => r.correct).length;
    const total = results.length;
    const score = Math.round((correctCount / total) * 100);
    
    return (
      <div className={styles.reviewEnd}>
        <h2>Review Complete! ✅</h2>
        <p>You answered <strong>{correctCount}</strong> out of <strong>{total}</strong> correctly.</p>
        <p>Your score: <strong>{score}%</strong></p>
  
        <div className={styles.reviewActions}>
        <button onClick={handleReviewAgain} className={styles.reviewAgain}>
                     🔁 Review Again
            </button>
          <Link to="/flashcards" className={styles.backToList}>📋 Flashcard List</Link>
          <Link to="/" className={styles.backHome}>🏠 Home</Link>
        </div>
      </div>
    );
  }
  

  const currentCard = cards[currentIndex];

  return (
    
    <div className={styles.reviewContainer}>
        <div className={styles.streak}>
      🔥 Current Streak: {streak}
    </div>
      <div className={styles.card} onClick={handleFlip}>
        <p>{showAnswer ? currentCard.answer : currentCard.question}</p>
        <span className={styles.flipHint}>(click to flip)</span>
      </div>
      {showAnswer && (
        <div className={styles.answerButtons}>
          <button onClick={() => handleAnswer(true)} className={styles.correctBtn}>✔️ Correct</button>
          <button onClick={() => handleAnswer(false)} className={styles.incorrectBtn}>❌ Incorrect</button>
        </div>
      )}
    </div>
  );
}

export default ReviewFlashcards;
