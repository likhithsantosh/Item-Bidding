import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";
import axios from "axios";

const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(""); 
  const [auctions, setAuctions] = useState([]);
  const [stats, setStats] = useState({ totalAuctions: 0, activeUsers: 0, totalBids: 0 });
  const [loading, setLoading] = useState(true);

  // Categories data
  const categories = [
    { name: "Electronics", icon: "📱", count: "250+ items", color: "#667eea" },
    { name: "Art & Collectibles", icon: "🎨", count: "180+ items", color: "#f093fb" },
    { name: "Jewelry", icon: "💎", count: "95+ items", color: "#4facfe" },
    { name: "Vintage Cars", icon: "🚗", count: "45+ items", color: "#fa709a" },
    { name: "Antiques", icon: "🏺", count: "320+ items", color: "#764ba2" },
    { name: "Sports", icon: "⚽", count: "150+ items", color: "#00f2fe" }
  ];

  // Features data
  const features = [
    { title: "Secure Bidding", description: "Advanced encryption and fraud protection", icon: "🔒" },
    { title: "Real-time Updates", description: "Live bid tracking and notifications", icon: "⚡" },
    { title: "Expert Verification", description: "All items authenticated by professionals", icon: "✅" },
    { title: "24/7 Support", description: "Round-the-clock customer assistance", icon: "🎧" }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } }) 
        .then(response => {
          const fullName = response.data.name;
          const firstName = fullName.split(' ')[0]; 
          setUsername(firstName); 
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
          }
          console.error("Error fetching user details", error);
        });
    }
    
    // Simulate loading time
    setTimeout(() => setLoading(false), 1500);
  }, []);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auctions/random?count=6`); 
        if (response.data && Array.isArray(response.data)) {
          setAuctions(response.data);
        }
      } catch (error) {
        console.error("Error fetching auctions", error);
      }
    };
    
    // Simulate stats API call
    const fetchStats = () => {
      setStats({ totalAuctions: 2847, activeUsers: 15643, totalBids: 89521 });
    };
    
    fetchAuctions();
    fetchStats();
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading BidPlus...</p>
      </div>
    );
  }

  return (
    <div className="landing-wrapper">
      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="floating-element" style={{top: '10%', left: '10%', animationDelay: '0s'}}>💎</div>
        <div className="floating-element" style={{top: '20%', right: '15%', animationDelay: '2s'}}>🏆</div>
        <div className="floating-element" style={{bottom: '30%', left: '5%', animationDelay: '4s'}}>⚡</div>
        <div className="floating-element" style={{bottom: '10%', right: '20%', animationDelay: '6s'}}>🎨</div>
      </div>

      <div className="container mt-5">
        {/* Main Header */}
        {!isLoggedIn ? (
          <header className="landing-header">
            <div className="header-content">
              <img src="/logo2.svg" alt="BidPlus Logo" className="logo-img" width={200}/>
              <h1 className="display-4 fw-bold text-primary">Welcome to BidPlus!</h1>
              <p className="lead">Your premium destination for authentic auctions and rare finds.</p>
              <div className="header-stats">
                <div className="stat-item">
                  <span className="stat-number">{formatNumber(stats.totalAuctions)}</span>
                  <span className="stat-label">Active Auctions</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{formatNumber(stats.activeUsers)}</span>
                  <span className="stat-label">Happy Bidders</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{formatNumber(stats.totalBids)}</span>
                  <span className="stat-label">Bids Placed</span>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/signup" className="btn btn-warning btn-lg fw-bold pulse-btn">
                  Start Bidding Now
                  <span className="btn-arrow">→</span>
                </Link>
                <p className="signup-note">Join thousands of satisfied bidders</p>
              </div>
            </div>
          </header>
        ) : (
          <header className="landing-header welcome-back">
            <div className="welcome-animation">
              <h1 className="display-4 fw-bold text-primary">
                Welcome Back, {username}! 👋
              </h1>
              <p className="lead">Ready to discover your next treasure?</p>
              <div className="quick-actions">
                <Link to="/auctions" className="btn btn-success btn-lg fw-bold">
                  Browse Auctions
                  <span className="btn-arrow">→</span>
                </Link>
                <Link to="/profile" className="btn btn-outline-light btn-lg">
                  My Profile
                </Link>
              </div>
            </div>
          </header>
        )}

        {/* Categories Section */}
        <section className="categories-section">
          <h2 className="section-title">Explore Categories</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card" style={{'--category-color': category.color}}>
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.count}</p>
                <div className="category-overlay"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Auctions Section */}
        <section className="auctions-section">
          <h2 className="section-title">Featured Auctions</h2>
          <p className="section-subtitle">Discover premium items from verified sellers</p>
          <div className="auctions-grid">
            {auctions.length > 0 ? (
              auctions.map((item, index) => (
                <div key={item._id} className="auction-card" style={{'--card-delay': `${index * 0.1}s`}}>
                  <div className="card-image-container">
                    <img 
                      src={item.image ? `${process.env.REACT_APP_API_URL}/${item.image}` : '/default-auction.png'} 
                      alt={item.item} 
                      className="card-img-top"
                      onError={(e) => {
                        e.target.src = '/default-auction.png';
                      }}
                    />
                    <div className="card-badge">Featured</div>
                    <div className="card-timer">
                      <span className="timer-icon">⏰</span>
                      <span>2d 14h left</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{item.item}</h5>
                    <div className="bid-info">
                      <div className="current-bid">
                        <span className="bid-label">Current Bid</span>
                        <span className="bid-amount">${item.startingBid}</span>
                      </div>
                      <div className="bid-count">
                        <span className="bidders-count">{Math.floor(Math.random() * 50) + 5} bids</span>
                      </div>
                    </div>
                    <Link to={`/auction/${item._id}`} className="btn btn-success btn-bid">
                      Place Bid
                      <span className="btn-arrow">→</span>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-auctions">
                <div className="no-auctions-icon">📦</div>
                <p>No auctions available at the moment</p>
                <p className="text-muted">Check back soon for exciting new items!</p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">Why Choose BidPlus?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Start Your Bidding Journey?</h2>
            <p>Join thousands of satisfied customers and discover amazing deals every day.</p>
            {!isLoggedIn && (
              <div className="cta-buttons">
                <Link to="/signup" className="btn btn-warning btn-lg">
                  Create Free Account
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Scroll to top button */}
      <button className="scroll-to-top" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
        ↑
      </button>
    </div>
  );
};

export default LandingPage;