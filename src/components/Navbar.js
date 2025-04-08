import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../App.module.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import logo from '../assets/logo.webp';


function NavigationBar() {
    return (
      <Navbar expand="md" bg="light" variant="light" fixed="top" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand as={NavLink} to="/" >
            {<img src={logo} alt="MemoCards Logo" height="30" className="me-2" />}
            <strong className="fs-4">StudyCards</strong>
          </Navbar.Brand>
  
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
  
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center">
            <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
              <i className="fas fa-home me-1"></i> Home
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
              <i className="fas fa-sign-in-alt me-1"></i> Log In
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
              <i className="fas fa-user-plus me-1"></i> Register
            </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
  
  export default NavigationBar;