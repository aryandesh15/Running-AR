import React, { useState } from 'react';

// Theme colors:
//  - #ff5733
//  - #8f6cc1
//  - #6c87c1

function LoginRegisterForm() {
  // activeView can be: "home", "about", "login", "register", or "qr"
  const [activeView, setActiveView] = useState("home");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Handle CTA click: show the login form
  const handleCTAClick = () => {
    setActiveView("login");
    setMessage('');
  };

  // Toggle between login and register modes (when in a form view)
  const handleToggleMode = () => {
    if (activeView === "login") {
      setActiveView("register");
    } else if (activeView === "register") {
      setActiveView("login");
    }
    setMessage('');
  };

  // Submit the login or registration form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = activeView === "register"
      ? 'http://localhost:8000/register'
      : 'http://localhost:8000/login';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.detail || 'An error occurred');
        return;
      }
      const data = await response.json();
      if (activeView === "login") {
        // Login successful: switch to QR view
        setActiveView("qr");
      } else {
        // Registration successful: inform user and switch to login mode
        setMessage('Registration successful! Please log in.');
        setActiveView("login");
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={styles.header}>
        <nav style={styles.nav}>
          <div style={styles.leftNav}>
            <ul style={styles.navList}>
              <li style={styles.navItem}>
                <a
                  href="#home"
                  style={styles.navLink}
                  onClick={() => { setActiveView("home"); setMessage(''); }}
                >
                  Home
                </a>
              </li>
              <li style={styles.navItem}>
                <a
                  href="#login"
                  style={styles.navLink}
                  onClick={() => { setActiveView("login"); setMessage(''); }}
                >
                  Login
                </a>
              </li>
              <li style={styles.navItem}>
                <a
                  href="#signup"
                  style={styles.navLink}
                  onClick={() => { setActiveView("register"); setMessage(''); }}
                >
                  Sign Up
                </a>
              </li>
            </ul>
          </div>
          <div style={styles.rightNav}>
            <ul style={styles.navList}>
              <li style={styles.navItem}>
                <a
                  href="#about"
                  style={styles.navLink}
                  onClick={() => { setActiveView("about"); setMessage(''); }}
                >
                  About
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        <div style={styles.callToAction}>
          {/* Home/Welcome CTA View */}
          {activeView === "home" && (
            <>
              <h1 style={styles.title}>Welcome to AR Fitness Coach</h1>
              <p style={styles.subtitle}>
                Experience a new level of interactive fitness from the comfort of your home.
              </p>
              <button style={styles.ctaButton} onClick={handleCTAClick}>
                Register for free to try AR fitness coach
              </button>
            </>
          )}

          {/* About View */}
          {activeView === "about" && (
            <div style={{ textAlign: 'center' }}>
              <h2>About AR Fitness Coach</h2>
              <p style={styles.subtitle}>
                AR Fitness Coach is designed to give you a revolutionary fitness experience using augmented reality.
              </p>
            </div>
          )}

          {/* Login/Register Form View */}
          {(activeView === "login" || activeView === "register") && (
            <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
              <h2>{activeView === "login" ? 'Login' : 'Register'}</h2>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.inputField}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.inputField}
                required
              />
              <button type="submit" style={styles.formButton}>
                {activeView === "login" ? 'Login' : 'Register'}
              </button>
              {message && <p style={styles.message}>{message}</p>}
              <button type="button" onClick={handleToggleMode} style={styles.toggleButton}>
                {activeView === "login"
                  ? "Don't have an account? Register"
                  : 'Already have an account? Login'}
              </button>
            </form>
          )}

          {/* Logged-in (QR Code) View */}
          {activeView === "qr" && (
            <div style={{ textAlign: 'center' }}>
              <h2>Scan this QR code on your mobile phone:</h2>
              {/* Insert your QR code image here if desired */}
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        Made with <span style={styles.heart}>❤️</span> in ATL
      </footer>
    </div>
  );
}

const HEADER_HEIGHT = 60; // px
const FOOTER_HEIGHT = 40; // px

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 0,
    minHeight: '100vh',
    position: 'relative',
  },
  /* HEADER STYLES */
  header: {
    backgroundColor: 'rgba(52, 1, 88, 0.9)', // darker indigo, high opacity
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: `${HEADER_HEIGHT}px`,
    display: 'flex',
    alignItems: 'center',
    zIndex: 1000,
  },
  nav: {
    display: 'flex',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftNav: {
    display: 'flex',
  },
  rightNav: {
    display: 'flex',
  },
  navList: {
    display: 'flex',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  navItem: {
    marginRight: '20px',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'color 0.3s',
  },
  /* MAIN / BACKGROUND STYLES */
  main: {
    marginTop: `${HEADER_HEIGHT}px`, // start below header
    paddingBottom: `${FOOTER_HEIGHT}px`, // ensure content isn't hidden behind footer
    minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`, // extend to bottom of viewport
    background: `url('/run.jpg') center top no-repeat`,
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed', // background stays fixed
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end', // align white container to the right
  },
  callToAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '40px',
    marginRight: '5%',
    borderRadius: '8px',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    color: '#ff5733', // theme color
    fontSize: '2rem',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#333',
    fontSize: '1rem',
    marginBottom: '20px',
  },
  ctaButton: {
    backgroundColor: '#6c87c1', // theme color
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    fontSize: '1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  /* FORM STYLES */
  inputField: {
    width: '90%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  formButton: {
    backgroundColor: '#6c87c1',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    fontSize: '1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#6c87c1',
    cursor: 'pointer',
    marginTop: '10px',
    textDecoration: 'underline',
  },
  message: {
    color: '#ff5733',
    marginTop: '10px',
  },
  /* FOOTER STYLES */
  footer: {
    backgroundColor: 'rgba(75, 0, 130, 0.3)', // darker indigo, low opacity
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: `${FOOTER_HEIGHT}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    zIndex: 1000,
  },
  heart: {
    color: '#ff5733',
    margin: '0 4px',
  },
};

export default LoginRegisterForm;
