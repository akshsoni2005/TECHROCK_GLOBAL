// src/pages/Hub/DashboardHub.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DashboardHub.css';

const DashboardHub = () => {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [clientData, setClientData] = useState({ 
        name: 'Loading...', 
        business: 'Loading...',
        stock_remaining: 0,
        total_revenue: 0
    });

    // FIXED: Now fetches from Django backend instead of broken localStorage
    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/clients/get-by-crm/?crm_id=${clientId}`);
                if (res.data.status === 'success') {
                    setClientData({
                        name: res.data.name,
                        business: res.data.business,
                        stock_remaining: res.data.stock_remaining,
                        total_revenue: res.data.total_revenue
                    });
                }
            } catch (error) {
                console.error("Failed to fetch client data:", error);
                setClientData({ name: clientId, business: 'Unknown', stock_remaining: 0, total_revenue: 0 });
            }
        };
        if (clientId) fetchClientData();
    }, [clientId]);

    return (
        <div className="premium-hub">
            <nav className="top-nav">
                <span className="logo">TECHROCK GLOBAL</span>
                <button className="logout-btn" onClick={() => navigate('/')}>Logout</button>
            </nav>

            <header className="hero-header">
                <h1>{clientData.business}</h1>
                <p className="subtitle">Merchant Dashboard | ID: {clientId}</p>
            </header>

            <div className="main-grid">
                {/* 1. Chat Support */}
                <div className="solid-card chat-theme" onClick={() => navigate(`/chat/${clientId}`)}>
                    <div className="icon">💬</div>
                    <h2>AI CHAT SUPPORT</h2>
                </div>

                {/* 2. Payment / Khata */}
                <div className="solid-card pay-theme" onClick={() => navigate(`/payment/${clientId}`)}>
                    <div className="icon">💳</div>
                    <h2>PAYMENT / KHATA</h2>
                </div>

                {/* 3. Combined Business Insights (Bottom) */}
                <div className="solid-card insights-theme full-width" onClick={() => navigate(`/sales/${clientId}`)}>
                    <div className="icons-combined">
                        <span>📊</span>
                        <div className="v-divider"></div>
                        <span>📦</span>
                    </div>
                    <h2>BUSINESS INSIGHTS</h2>
                    <p>Statistics & Inventory Management</p>
                </div>
            </div>

            <footer className="footer-simple">
                © 2026 TechRockGlobal | Developed by Aksh
            </footer>
        </div>
    );
};

export default DashboardHub;