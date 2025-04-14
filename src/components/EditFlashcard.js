import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/AuthForm.module.css';
import api from '../utils/api';

function EditFlashcard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    topic: '',
    status: 'new',
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchFlashcard = async () => {
      try {
        const response = await api.get(`/api/flashcards/${id}/`);
        setFormData(response.data);
      } catch (err) {
        console.error('Error loading flashcard:', err);
        setErrors(['Failed to load flashcard.']);
      }
    };

    fetchFlashcard();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/api/flashcards/${id}/`, formData);
      navigate('/flashcards');
    } catch (err) {
      console.error('Error updating flashcard:', err);
      setErrors(['Failed to update flashcard.']);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Edit Flashcard</h2>

      {errors.length > 0 && (
        <div className={styles.errorContainer}>
          <ul className={styles.errorList}>
            {errors.map((err, i) => (
              <li key={i} className={styles.alertBox}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formInput}>
          <input
            type="text"
            name="question"
            placeholder="Question"
            value={formData.question}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formInput}>
          <input
            type="text"
            name="answer"
            placeholder="Answer"
            value={formData.answer}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formInput}>
          <input
            type="text"
            name="topic"
            placeholder="Topic"
            value={formData.topic}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.formInput}>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={styles.inputField}
          >
            <option value="new">New</option>
            <option value="reviewing">Reviewing</option>
            <option value="mastered">Mastered</option>
          </select>
        </div>
        <button type="submit" className={styles.formButton}>
          Update Flashcard
        </button>
      </form>
    </div>
  );
}

export default EditFlashcard;
