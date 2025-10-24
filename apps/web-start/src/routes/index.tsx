import { createFileRoute } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import '../style/Homepage.css';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  // Get Auth0 login function
  const { loginWithRedirect } = useAuth0();

  const navigationItems = [
    { name: "About", href: "#about" },
    { name: "Contact Us", href: "#contact" }
  ];

  // Trigger Auth0 login flow
  const handleLoginClick = () => {
    loginWithRedirect({
      appState: {
        returnTo: '/home' // Where to redirect after successful login
      }
    });
  };

  // Trigger Auth0 signup flow
  const handleSignupClick = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup', // This tells Auth0 to show signup screen
      },
      appState: {
        returnTo: '/home'
      }
    });
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
                <button className="login-btn" onClick={handleLoginClick}>
                  Log in
                </button>
                <button className="signup-btn" onClick={handleSignupClick}>
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main>
          <div className="main-content">
            <div className="hero-grid">
              <div className="hero-content">
                <h1 className="hero-title">
                  Learning Hub
                  <br />
                  <span className="hero-title-accent">Achieve everything.</span>
                </h1>
                
                <p className="hero-description">
                  Transform your learning journey with our comprehensive LMS platform. 
                  Access courses, track progress, and connect with learners worldwide.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}