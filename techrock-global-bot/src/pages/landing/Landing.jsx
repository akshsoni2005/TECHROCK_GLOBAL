// src/pages/landing/Landing.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-wrapper">
            {/* Header with Client Login on the side */}
            <header className="nav-container">
                <div className="brand-name">TECHROCK GLOBAL</div>
                <button className="login-trigger-btn" onClick={() => navigate('/login')}>
                    Client Login
                </button>
            </header>

            {/* Hero Section */}
            <main className="hero-main">
                <h1>Next-Gen Saree <br /> Business Bot</h1>
                <p style={{fontSize: '1.2rem', maxWidth: '600px', opacity: 0.9}}>
                    Professional WhatsApp automation built for modern merchants. 
                    Manage your stock, sales, and payments in one dashboard.
                </p>
                {/* Aksh bhai, yahan naya button add kiya hai Sign Up ke liye */}
                <button className="signup-trigger-btn" onClick={() => navigate('/signup')} style={{marginTop: '20px', padding: '12px 30px', backgroundColor: '#25d366', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold'}}>
                    Register Your Business
                </button>
            </main>

            {/* Features Section */}
            <section className="features-grid">
              <div className="feature-item">
                 <h2>Our Mission</h2>
                  <p>At TechRockGlobal, Aksh is dedicated to bringing cutting-edge AI to the textile industry. We simplify complex stock management so you can focus on sales.</p>
                </div>
                <div className="feature-item">
                 <h2>24/7 Support</h2>
                  <p>Our bots never sleep. Whether it's 2 PM or 2 AM, your customers get the price and stock details they need instantly.</p>
                </div>
            </section>

            {/* About Organization Section */}
            <section className="org-info-section" style={{display: 'flex', gap: '40px', padding: '60px 10%', alignItems: 'center'}}>
                <div style={{flex: 1}}>
                    <h2 style={{color: '#075e54'}}>About Our Organisation</h2>
                    <p style={{lineHeight: '1.6', color: '#64748b'}}>
                        TechRockGlobal is a premier automation firm dedicated to 
                        scaling cloth businesses. We provide 24/7 smart-reply bots 
                        and inventory management systems.
                    </p>
                </div>
                <div style={{flex: 1, backgroundColor: '#f1f5f9', padding: '30px', borderRadius: '15px'}}>
                    <h3 style={{marginTop: 0}}>Our Expertise</h3>
                    <ul style={{color: '#475569'}}>
                        <li>Real-time WhatsApp Integration</li>
                        <li>Automated Sales Analytics</li>
                        <li>Secure Merchant Khata</li>
                    </ul>
                </div>
            </section>

            <footer style={{ textAlign: 'center', padding: '40px', backgroundColor: '#075e54', color: 'white' }}>
             <p>© 2026 TechRockGlobal Organisation. All Rights Reserved.</p>
             <p>Contact Aksh for custom bot development.</p>
            </footer>
        </div>
    );
};

export default Landing;