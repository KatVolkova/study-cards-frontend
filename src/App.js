import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './App.module.css';
import NavigationBar from './components/Navbar';
import Home from './pages/Home'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';



function App() {
  return (
    <div className={styles.App}>
    <Router>
      <NavigationBar />
      <main className={styles.MainContent}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      </main>
      <Footer />
    </Router>
  </div>
  );
}

export default App;