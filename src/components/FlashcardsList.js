import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import styles from '../styles/Flashcards.module.css'; 

function FlashcardsList() {
  const [flashcards, setFlashcards] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFlashcards = async (url = '/api/flashcards/?limit=5') => {
    try {
      const response = await api.get(url);
      setFlashcards(prev => [...prev, ...response.data.results]);
      setNextUrl(response.data.next);
    } catch (err) {
      console.error("Error fetching flashcards:", err);
      setError("Failed to fetch flashcards. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  useEffect(() => {
    if (!nextUrl) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchFlashcards(nextUrl);
        }
      },
      { threshold: 1 }
    );

    const sentinel = document.querySelector("#scroll-sentinel");
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [nextUrl]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this flashcard?");
    if (!confirmDelete) return;
  
    try {
      await api.delete(`/api/flashcards/${id}/`);
      setFlashcards((prevCards) => prevCards.filter((card) => card.id !== id));
    } catch (err) {
      console.error("Error deleting flashcard:", err);
      alert("Failed to delete flashcard. Please try again.");
    }
  };
  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.flashcardsContainer}>
      <h2 className={styles.header}>My Flashcards</h2>
      <button className={styles.createButton}>
  <Link to="/flashcards/create" style={{ textDecoration: 'none', color: 'inherit' }}>
    + Create Flashcard
  </Link>
</button>

      {flashcards.length === 0 ? (
        <p>No flashcards found. Try creating one!</p>
      ) : (
        <ul className={styles.flashcardsList}>
          {flashcards.map((card) => (
            <li key={card.id} className={styles.flashcardItem}>
              <h3 className={styles.question}>{card.question}</h3>
              <p className={styles.answer}>{card.answer}</p>
              {card.topic && <span className={styles.topic}>Topic: {card.topic}</span>}
              <span className={styles.status}>Status: {card.status}</span>
              <div className={styles.cardActions}>
      <Link to={`/flashcards/${card.id}/edit`} className={styles.editButton}>
        ✏️ Edit
      </Link>
      <button
      onClick={() => handleDelete(card.id)}
      className={styles.deleteButton}
        >
      🗑️ Delete
      </button>
    </div>
            </li>
          ))}
        </ul>
      )}
      <div id="scroll-sentinel" className={styles.sentinel}></div>
    </div>
  );
}

export default FlashcardsList;
