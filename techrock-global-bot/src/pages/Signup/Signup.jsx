// src/pages/Signup/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', business: '' });
    const [generatedId, setGeneratedId] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGenerate = async () => {
        if (!formData.name || !formData.business) {
            alert("Bhai pehle detail toh bhar!");
            return;
        }

        setLoading(true);
        try {
            // BACKEND CONNECTION
            const response = await axios.post('http://127.0.0.1:8000/api/signup/', {
                name: formData.name,
                business_name: formData.business
            });

            if (response.data.status === 'success') {
                const newId = response.data.crm_id; 
                setGeneratedId(newId);
                
                // IMPORTANT: Yahan hum ID save kar rahe hain taaki 
                // pure dashboard par yahi ID fetch ho aur ramesh4738 wala glitch na aaye.
                localStorage.setItem('active_crm_id', newId);
                localStorage.setItem('user_name', response.data.name);
                localStorage.setItem('business_name', response.data.business);

                alert(`Database mein entry ho gayi! Aapki ID: ${newId}`);
            }
        } catch (error) {
            console.error("Signup Error:", error);
            alert("Backend se connect nahi ho paya. Django check karo!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center', color: 'white', backgroundColor: '#0f172a', height: '100vh', fontFamily: 'sans-serif' }}>
            <h2 style={{color: '#25d366', fontSize: '2rem'}}>Register Your Business</h2>
            <p style={{color: '#94a3b8'}}>Details bharo aur apna dynamic dashboard activate karo</p>
            
            <div style={{ margin: '30px 0' }}>
                <input 
                    type="text" 
                    placeholder="Owner Name (e.g. Parm Vir)" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ padding: '12px', margin: '5px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white', width: '250px' }}
                />
                <input 
                    type="text" 
                    placeholder="Business Name (e.g. Parm Saree)" 
                    value={formData.business}
                    onChange={(e) => setFormData({...formData, business: e.target.value})}
                    style={{ padding: '12px', margin: '5px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white', width: '250px' }}
                />
            </div>
            
            <button 
                onClick={handleGenerate} 
                disabled={loading}
                style={{ 
                    padding: '12px 25px', 
                    backgroundColor: loading ? '#1e293b' : '#25d366', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    transition: '0.3s'
                }}
            >
                {loading ? 'Processing...' : 'Generate My Business ID'}
            </button>

            {generatedId && (
                <div style={{ marginTop: '30px', padding: '25px', border: '2px dashed #25d366', borderRadius: '15px', backgroundColor: '#1e293b' }}>
                    <p style={{margin: '0', color: '#94a3b8'}}>Aapka Unique CRM ID:</p>
                    <h2 style={{ color: '#fbbf24', fontSize: '2.5rem', margin: '10px 0' }}>{generatedId}</h2>
                    <p style={{color: '#25d366'}}>✓ Admin Panel mein save ho gaya hai</p>
                    <button 
                        onClick={() => navigate('/login')} 
                        style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Login to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default Signup;