import React from "react";
import styles from "../App.module.css"; 

function Footer() {
  

  return (
    <footer className={styles.Footer}>
      <div className={styles.footerContainer}>
        <div>Follow us:</div>
        <div className={styles.footerIcons}>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <i className="fab fa-facebook-f" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter" />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <i className="fab fa-instagram" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;