import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/AuthForm.module.css'; // reuse styling if you want

function CreateFlashcard() {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    topic: '',
    status: 'new',
  });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const { question, answer, topic, status } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const token = localStorage.getItem('token');

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/flashcards/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      navigate('/flashcards');
    } catch (error) {
      const messages = [];
      if (error.response?.data) {
        for (let key in error.response.data) {
          const val = error.response.data[key];
          if (Array.isArray(val)) {
            val.forEach((msg) => messages.push(`${key}: ${msg}`));
          } else {
            messages.push(`${key}: ${val}`);
          }
        }
      } else {
        messages.push('Something went wrong. Please try again.');
      }
      setErrors(messages);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Create Flashcard</h2>

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
            value={question}
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
            value={answer}
            onChange={handleChange}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formInput}>
          <input
            type="text"
            name="topic"
            placeholder="Topic (optional)"
            value={topic}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.formInput}>
          <select
            name="status"
            value={status}
            onChange={handleChange}
            className={styles.inputField}
          >
            <option value="new">New</option>
            <option value="reviewing">Reviewing</option>
            <option value="mastered">Mastered</option>
          </select>
        </div>
        <button type="submit" className={styles.formButton}>
          Save Flashcard
        </button>
      </form>
    </div>
  );
}

export default CreateFlashcard;
