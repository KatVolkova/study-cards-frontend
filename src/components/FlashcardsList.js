import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import styles from '../styles/Flashcards.module.css'; 

function FlashcardsList() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');


  const fetchFlashcards = async () => {
    try {
      const response = await api.get('/api/flashcards/?limit=1000');
      setFlashcards(response.data.results); 
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
<div className={styles.filters}>
  {/* Topic dropdown */}
  <select
    value={selectedTopic}
    onChange={(e) => setSelectedTopic(e.target.value)}
    className={styles.filterSelect}
  >
    <option value="">All Topics</option>
    {[...new Set(flashcards.map(card => card.topic).filter(Boolean))].map((topic, idx) => (
      <option key={idx} value={topic}>
        {topic}
      </option>
    ))}
  </select>

  {/* Status dropdown */}
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
    ✨ Clear Filters
  </button>
)}

</div>

      {flashcards
  .filter(card => 
    (!selectedTopic || card.topic === selectedTopic) &&
    (!selectedStatus || card.status === selectedStatus)
  ).length === 0 ? (
  <p>No matching flashcards found. Try adjusting your filters!</p>
) : (
        <ul className={styles.flashcardsList}>
          {flashcards
            .filter(card => 
              (!selectedTopic || card.topic === selectedTopic) &&
              (!selectedStatus || card.status === selectedStatus)
            )
            .map((card) => (
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
    </div>
  );
}

export default FlashcardsList;
