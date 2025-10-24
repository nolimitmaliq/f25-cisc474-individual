import { createFileRoute, Link } from '@tanstack/react-router';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import '../style/Homepage.css';

export const Route = createFileRoute('/home')({
  component: withAuthenticationRequired(HomePage),
  pendingComponent: () => <div>Loading user...</div>,
});

function HomePage() {
  const { user, logout } = useAuth0();

  // Navigation items - "Profile" now goes to students list (admin view)
  const navigationItems = [
    { name: "My Courses", href: "/courses" },
    { name: "Students", href: "/students" } // Changed from "Profile" to "Students" for clarity
  ];

  const handleLogoutClick = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <>
      <div className="container">
        <nav className="navbar">
          <div className="nav-content">
            <div className="nav-row">
              <div className="logo-section">
                <div className="logo-icon">
                  <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }}>L</span>
                </div>
                <span className="logo-text">LearnHub</span>
              </div>
              <div className="desktop-nav">
                <div className="nav-items">
                  {navigationItems.map((item) => (
                    <Link key={item.name} to={item.href} className="nav-link">
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="auth-buttons">
                <button className="login-btn" onClick={handleLogoutClick}>Log out</button>
              </div>
            </div>
          </div>
        </nav>
        <main>
          <div className="main-content">
            <div className="hero-grid">
              <div className="hero-content">
                <h1 className="hero-title">
                  Welcome back, <br />
                  <span className="hero-title-accent">{user?.name}!</span>
                </h1>
                <p className="hero-description">
                  Ready to continue your learning journey?
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}