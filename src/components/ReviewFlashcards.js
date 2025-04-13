import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Review.module.css';

function ReviewFlashcards() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/flashcards/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setCards(res.data);
      } catch (err) {
        console.error("Failed to load flashcards:", err);
      }
    };
    fetchCards();
  }, []);

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleAnswer = (correct) => {
    setResults([...results, { id: cards[currentIndex].id, correct }]);
    setShowAnswer(false);
    setCurrentIndex(currentIndex + 1);
  };

  if (cards.length === 0) return <p>No flashcards to review!</p>;
  if (currentIndex >= cards.length) {
    return (
      <div className={styles.reviewEnd}>
        <h2>Review Complete! ✅</h2>
        <p>You answered {results.filter(r => r.correct).length} out of {results.length} correctly.</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className={styles.reviewContainer}>
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
