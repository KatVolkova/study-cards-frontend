
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Flashcards.module.css'; 

function FlashcardsList() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        // Retrieve the token from localStorage.
        const token = localStorage.getItem('token');

        // If token does not exist, set an error message.
        if (!token) {
          setError('User not authenticated. Please log in.');
          setLoading(false);
          return;
        }

        // Set up headers with the token.
        const config = {
          headers: { Authorization: `Token ${token}` } // or use `Bearer ${token}` if needed
        };
        // Make the GET request with the Authorization header.
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/flashcards/`, config);

        setFlashcards(response.data);
      } catch (err) {
        console.error("Error fetching flashcards:", err);
        setError("Failed to fetch flashcards. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.flashcardsContainer}>
      <h2 className={styles.header}>My Flashcards</h2>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FlashcardsList;
