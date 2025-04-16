import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
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
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [reviewEnded, setReviewEnded] = useState(false);

  const fetchCards = useCallback(async (url = `/api/flashcards/?limit=100`) => {
    if (isFetchingMore || reviewEnded) return;
    setIsFetchingMore(true);

    try {
      const res = await api.get(url);

      setCards((prev) => {
        const existingIds = new Set(prev.map(card => card.id));
        const newCards = shuffleArray(res.data.results).filter(card => !existingIds.has(card.id));
        return [...prev, ...newCards];
      });

      setNextPage(res.data.next);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load flashcards:", err);
      setLoading(false);
    } finally {
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, reviewEnded]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        nextPage
      ) {
        fetchCards(nextPage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [nextPage, fetchCards]);

  const handleReviewAgain = () => {
    setCards([]);
    setCurrentIndex(0);
    setShowAnswer(false);
    setResults([]);
    setStreak(0);
    setReviewEnded(false);
    fetchCards();
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

  const saveReviewToServer = useCallback(async (score, total, correct) => {
    try {
      await api.post('/api/review-history/', { score, total, correct });
    } catch (err) {
      console.error("Failed to save review history to server:", err);
    }
  }, []);

  useEffect(() => {
    if (currentIndex >= cards.length && !reviewEnded && cards.length > 0) {
      const correctCount = results.filter(r => r.correct).length;
      const total = results.length;
      const score = Math.round((correctCount / total) * 100);

      saveReviewToServer(score, total, correctCount);
      setReviewEnded(true);
    }
  }, [currentIndex, reviewEnded, cards.length, results, saveReviewToServer]);

  // 🔒 Protect against undefined access
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

  if (reviewEnded) {
    const correctCount = results.filter(r => r.correct).length;
    const total = results.length;
    const score = Math.round((correctCount / total) * 100);

    return (
      <div className={styles.reviewEnd}>
        <h2>Review Complete! ✅</h2>
        <p>You answered <strong>{correctCount}</strong> out of <strong>{total}</strong> correctly.</p>
        <p>Your score: <strong>{score}%</strong></p>

        <div className={styles.reviewActions}>
          <button onClick={handleReviewAgain} className={styles.reviewAgain}>🔁 Review Again</button>
          <Link to="/flashcards" className={styles.backToList}>📋 Flashcard List</Link>
          <Link to="/" className={styles.backHome}>🏠 Home</Link>
        </div>
      </div>
    );
  }

  // ✅ Only define currentCard after checks
  const currentCard = cards[currentIndex] || null;

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.streak}>
        🔥 Current Streak: {streak}
      </div>

      {currentCard && (
        <div className={styles.card} onClick={handleFlip}>
          <p>{showAnswer ? currentCard.answer : currentCard.question}</p>
          <span className={styles.flipHint}>(click to flip)</span>
        </div>
      )}

      {showAnswer && currentCard && (
        <div className={styles.answerButtons}>
          <button onClick={() => handleAnswer(true)} className={styles.correctBtn}>✔️ Correct</button>
          <button onClick={() => handleAnswer(false)} className={styles.incorrectBtn}>❌ Incorrect</button>
        </div>
      )}
    </div>
  );
}

export default ReviewFlashcards;
