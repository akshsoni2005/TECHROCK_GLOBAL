import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './chat.css';

const Chat = () => {
    const { clientId } = useParams(); 
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    const [client, setClient] = useState({ name: "Loading...", id: clientId });
    const [selectedChat, setSelectedChat] = useState({ name: "Rahul Sharma", number: "+91 98765-43210" });
    const [message, setMessage] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [sentItems, setSentItems] = useState([]);

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/clients/get-by-crm/?crm_id=${clientId}`);
                if (res.data.status === 'success') {
                    setClient({ name: res.data.business || res.data.name || clientId, id: clientId });
                }
            } catch (error) { setClient({ name: clientId, id: clientId }); }
        };
        if (clientId) fetchClientData();
    }, [clientId]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            setSentItems([...sentItems, {
                id: Date.now(),
                type: file.type.startsWith('image/') ? 'image' : 'file',
                content: event.target.result,
                fileName: file.name,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        };
        reader.readAsDataURL(file);
    };

    const theme = {
        bg: isDarkMode ? "#0b141a" : "#f0f2f5",      
        side: isDarkMode ? "#111b21" : "#ffffff", 
        header: isDarkMode ? "#202c33" : "#ededed",  
        text: isDarkMode ? "#e9edef" : "#111b21",
        secondary: isDarkMode ? "#8696a0" : "#666",
        msgSent: isDarkMode ? "#005c4b" : "#dcf8c6",
        msgReceived: isDarkMode ? "#202c33" : "#ffffff",
        border: isDarkMode ? "#222d34" : "#ddd"
    };

    return (
        <div className="whatsapp-layout" style={{ backgroundColor: theme.bg, color: theme.text }}>
            {/* Left Sidebar */}
            <aside className="contact-sidebar" style={{ backgroundColor: theme.side, borderRight: `1px solid ${theme.border}` }}>
                <header className="sidebar-top" style={{ backgroundColor: theme.header }}>
                    <button className="hub-btn-new" onClick={() => navigate(`/hub/${clientId}`)}>← Hub</button>
                    <div style={{color: theme.text, fontSize: '14px'}}>Monitoring: <b>{client.name}</b></div>
                </header>
                
                <div className="contact-list">
                    <div className="contact-item active" style={{ backgroundColor: isDarkMode ? "#2a3942" : "#ebebeb", borderBottom: `1px solid ${theme.border}` }}>
                        <div className="contact-avatar-box" style={{backgroundColor: "#25d366"}}>R</div>
                        <div className="contact-info">
                            <span className="c-name" style={{color: theme.text}}>Rahul Sharma</span>
                            <p className="c-msg" style={{color: theme.secondary}}>Active Now</p>
                        </div>
                    </div>
                </div>

                <div className="theme-toggle-container" style={{padding: '10px', borderTop: `1px solid ${theme.border}` }}>
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="mode-btn-whatsapp">
                        {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                    </button>
                </div>
            </aside>

            {/* Right Chat Window */}
            <main className="chat-window" style={{ 
                backgroundImage: isDarkMode ? 'none' : 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                backgroundColor: theme.bg 
            }}>
                <header className="chat-window-header" style={{ backgroundColor: theme.header, borderBottom: `1px solid ${theme.border}` }}>
                    <div className="chat-header-info">
                        <h3 style={{color: theme.text, margin: 0}}>{selectedChat.name}</h3>
                        <span style={{color: theme.secondary, fontSize: '12px'}}>{selectedChat.number}</span>
                    </div>
                </header>
                
                <div className="message-area" style={{padding: '20px', display: 'flex', flexDirection: 'column'}}>
                    <div className="msg-received" style={{ backgroundColor: theme.msgReceived, color: theme.text, padding: '10px', borderRadius: '8px', marginBottom: '10px', maxWidth: '70%' }}>
                        <p style={{margin: 0}}>TechRock Bot is monitoring stock for <b>{client.name}</b>.</p>
                        <span style={{fontSize: '10px', color: theme.secondary, float: 'right'}}>Just now</span>
                    </div>

                    {sentItems.map(item => (
                        <div key={item.id} className="msg-sent" style={{ backgroundColor: theme.msgSent, color: theme.text, padding: '10px', borderRadius: '8px', marginBottom: '10px', alignSelf: 'flex-end', maxWidth: '70%' }}>
                            {item.type === 'image' ? <img src={item.content} alt="sent" style={{ maxWidth: '100%', borderRadius: '5px' }} /> : <p>📄 {item.fileName}</p>}
                            <span style={{fontSize: '10px', color: theme.secondary, float: 'right', marginTop: '5px'}}>{item.time}</span>
                        </div>
                    ))}
                </div>

                <footer className="chat-input-bar" style={{ backgroundColor: theme.header }}>
                    <input type="file" ref={fileInputRef} style={{display: 'none'}} onChange={handleFileSelect} accept="image/*, .pdf, .doc"/>
                    <button className="icon-btn" onClick={() => fileInputRef.current.click()} style={{color: theme.secondary}}>📎</button>
                    <input 
                        type="text" 
                        placeholder="Type a message..." 
                        style={{ backgroundColor: isDarkMode ? "#2a3942" : "#fff", color: theme.text, flex: 1, margin: '0 10px', border: 'none', padding: '10px', borderRadius: '20px' }}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className="send-btn" style={{backgroundColor: "#00a884", color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '20px'}}>Send</button>
                </footer>
            </main>
        </div>
    );
};

export default Chat;