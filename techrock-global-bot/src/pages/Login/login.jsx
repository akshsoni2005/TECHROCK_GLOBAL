// src/pages/Login/login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [clientId, setClientId] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!clientId) return alert("Please enter your Business ID!");
        
        setLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/check-status/?crm_id=${clientId}`);

            if (response.data.status === 'success') {
                localStorage.setItem('active_crm_id', clientId); 
                navigate(`/hub/${clientId}`);
            }
        } catch (error) {
            alert("Invalid ID or not registered yet!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#0f172a', color: 'white', height: '100vh' }}>
            <h2 style={{color: '#10b981'}}>Client Login</h2>
            <p>Enter your Unique Business ID</p>
            
            <input 
                type="text" 
                placeholder="Enter Business ID (e.g. TR-7228)" 
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                style={{ padding: '12px', width: '250px', borderRadius: '5px', border: 'none', marginTop: '20px', color: 'black' }}
            />
            <br />
            <button 
                onClick={handleLogin}
                disabled={loading}
                style={{ 
                    marginTop: '20px', 
                    padding: '10px 30px', 
                    backgroundColor: loading ? '#6b7280' : '#10b981', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer', 
                    fontWeight: 'bold' 
                }}
            >
                {loading ? "Checking..." : "Login to Dashboard"}
            </button>
        </div>
    );
};

export default Login;