"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './Style/HomePage.css';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  const navigationItems = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
    { name: "Contact Us", href: "#contact" }
  ];

  const handleLoginClick = () => {
    console.log("Login button clicked!");
    console.log("Attempting to navigate to /login");
    router.push("/login");
};

  return (
    <>
      <div className="container">
        <nav className="navbar">
          <div className="nav-content">
            <div className="nav-row">
              {/* Logo */}
              <div className="logo-section">
                <div className="logo-icon">
                  <span style={{color: 'white', fontWeight: 'bold', fontSize: '0.875rem'}}>L</span>
                </div>
                <span className="logo-text">LearnHub</span>
              </div>
              <div className="desktop-nav">
                <div className="nav-items">
                  {navigationItems.map((item) => (
                    <a key={item.name} href={item.href} className="nav-link">
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="auth-buttons">
                <button className="login-btn" onClick={handleLoginClick}>Log in</button>
                <button className="signup-btn">Sign up</button>
              </div>
            </div>
          </div>
        </nav>
        <main>
          <div className="main-content">
            <div className="hero-grid">
              <div className="hero-content">
                <h1 className="hero-title">
                  Learning Space
                  <br />
                  <span className="hero-title-accent">Achieve everything.</span>
                </h1>
                
                <p className="hero-description">
                  Transform your learning journey with our comprehensive LMS platform. 
                  Access courses, track progress, and connect with learners worldwide—all 
                  powered by cutting-edge AI technology.
                </p>
                
                <div className="cta-buttons">
                  <button className="primary-btn">
                    Start learning for free
                    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                  <button className="secondary-btn">
                    Watch demo
                    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-5-8a3 3 0 110 6H9V7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}