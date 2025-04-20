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
  const [reviewEnded, setReviewEnded] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filteredCards = cards.filter(card => 
    (!selectedTopic || card.topic === selectedTopic) &&
    (!selectedStatus || card.status === selectedStatus)
  );

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/flashcards/?limit=100`);

      setCards(shuffleArray(res.data.results));
      setLoading(false);
    } catch (err) {
      console.error("Failed to load flashcards:", err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

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
    const currentCard = filteredCards[currentIndex];
    if (!currentCard) return;

    setResults((prevResults) => [
      ...prevResults,
      { id: currentCard.id, correct },
    ]);

    setStreak((prevStreak) => (correct ? prevStreak + 1 : 0));
    setShowAnswer(false);
    setCurrentIndex(currentIndex + 1);
  };

  useEffect(() => {
    if (currentIndex >= filteredCards.length && !reviewEnded && filteredCards.length > 0) {
      setReviewEnded(true);
    }
  }, [currentIndex, reviewEnded, filteredCards.length]);

  const saveReviewResult = async (correctCount, total, score, streak) => {
    try {
      await api.post('/api/review-history/', {
        correct: correctCount,
        total: total,
        score: score,
        streak: streak,
      });
      console.log(' Review history saved!');
    } catch (error) {
      console.error(' Failed to save review history:', error);
    }
  };

  useEffect(() => {
    if (reviewEnded && results.length > 0) {
      const correctCount = results.filter(r => r.correct).length;
      const total = results.length;
      const score = Math.round((correctCount / total) * 100);

      saveReviewResult(correctCount, total, score, streak);
    }
  }, [reviewEnded, results, streak]);

  const currentCard = filteredCards[currentIndex] || null;

  
  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Loading flashcards...</p>
      </div>
    );
  }

  if (filteredCards.length === 0 && !loading) {
    return (
      <div className={styles.emptyMessage}>
        <p>No flashcards to review for now! Try clearing filters or adding new cards.</p>
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

  return (
    <div className={styles.reviewContainer}>
      <div className={styles.streak}>
        🔥 Current Streak: {streak}
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Topics</option>
          {[...new Set(cards.map(card => card.topic).filter(Boolean))].map((topic, idx) => (
            <option key={idx} value={topic}>
              {topic}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="reviewing">Reviewing</option>
          <option value="mastered">Mastered</option>
        </select>

        {(selectedTopic || selectedStatus) && (
          <button
            type="button"
            onClick={() => {
              setSelectedTopic('');
              setSelectedStatus('');
            }}
            className={styles.clearFiltersButton}
          >
            <i className="fas fa-eraser me-2"></i> Clear Filters
          </button>
        )}
      </div>

      {/* Flashcard */}
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
