import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import './Payment.css';

const Payment = () => {
    const navigate = useNavigate();
    const { clientId } = useParams(); 
    
    const [clientData, setClientData] = useState({
        name: "Loading...",
        pending: 0,
        received: 0,
        transactions: [],
        isLoading: true
    });
    
    const [paymentMode, setPaymentMode] = useState('QR Scanner');

    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/clients/get-by-crm/?crm_id=${clientId}`);
                if (res.data.status === 'success') {
                    setClientData({
                        name: res.data.business || res.data.name || clientId, 
                        pending: res.data.pending_amount || 0,
                        received: res.data.received_amount || 0,
                        transactions: res.data.transactions || [],
                        isLoading: false
                    });
                } else {
                    setClientData(prev => ({ ...prev, name: clientId, isLoading: false }));
                }
            } catch (error) {
                console.error("API Error:", error);
                setClientData(prev => ({ ...prev, name: clientId, isLoading: false }));
            }
        };
        if (clientId) fetchPaymentData();
    }, [clientId]);

    const downloadPDF = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.setTextColor(44, 62, 80);
            doc.text("Business Ledger Report", 14, 20);
            
            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text(`Account Name: ${clientData.name}`, 14, 32);
            doc.text(`Account ID: ${clientId}`, 14, 39);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 32);

            const tableRows = clientData.transactions.length > 0 
                ? clientData.transactions.map(t => [t.date, t.desc, t.status, `INR ${t.amount}`])
                : [['-', 'No transactions found', '-', '0']];

            autoTable(doc, {
                startY: 45,
                head: [['Date', 'Description', 'Status', 'Amount']],
                body: tableRows,
                theme: 'grid',
                headStyles: { fillColor: [41, 128, 185] },
            });

            const finalY = doc.lastAutoTable.finalY + 10;
            doc.text(`Total Received: INR ${clientData.received}`, 14, finalY);
            doc.text(`Total Pending: INR ${clientData.pending}`, 14, finalY + 7);

            doc.save(`Ledger_${clientData.name}.pdf`);
        } catch (error) {
            alert("PDF generation failed!");
        }
    };

    if (clientData.isLoading) return <div className="loading-screen">Verifying Account...</div>;

    return (
        <div className="payment-page">
            <header className="payment-header">
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
                <div className="header-info">
                    <h1>Payment Center</h1>
                    <p>Business: <span>{clientData.name}</span> | ID: {clientId}</p>
                </div>
            </header>

            <div className="payment-grid">
                <main className="payment-main">
                    <section className="method-card">
                        <h3>Select Payment Method</h3>
                        <div className="method-tabs">
                            {['QR Scanner', 'Cash', 'Bank Transfer'].map(mode => (
                                <button 
                                    key={mode} 
                                    className={paymentMode === mode ? 'active' : ''} 
                                    onClick={() => setPaymentMode(mode)}
                                >
                                    {mode === 'QR Scanner' ? 'QR (UPI)' : mode}
                                </button>
                            ))}
                        </div>

                        <div className="method-display">
                            {paymentMode === 'QR Scanner' ? (
                                <div className="qr-box">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=pay-${clientId}`} alt="QR" />
                                    <p>Scan to pay via UPI</p>
                                    <small>Payable to: {clientData.name}</small>
                                </div>
                            ) : (
                                <div className="detail-box">
                                    <p>Payment Mode: <strong>{paymentMode}</strong></p>
                                    <p>Payable to: <strong>{clientData.name}</strong></p>
                                    <p className="note">Please confirm details before transaction.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="ledger-card">
                        <h3>Recent Ledger</h3>
                        <table className="ledger-table">
                            <thead>
                                <tr><th>Date</th><th>Description</th><th>Amount</th></tr>
                            </thead>
                            <tbody>
                                {clientData.transactions.length > 0 ? (
                                    clientData.transactions.map((t, i) => (
                                        <tr key={i}>
                                            <td>{t.date}</td>
                                            <td>{t.desc}</td>
                                            <td className="green">₹{t.amount}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3" style={{textAlign: 'center'}}>No transactions yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </section>
                </main>

                <aside className="payment-sidebar">
                    <div className="stat-box red-bg">
                        <span>Pending</span>
                        <h2>₹{clientData.pending}</h2>
                    </div>
                    <div className="stat-box green-bg">
                        <span>Received</span>
                        <h2>₹{clientData.received}</h2>
                    </div>
                    <button className="pdf-download-btn" onClick={downloadPDF}>📥 Download PDF Report</button>
                </aside>
            </div>
        </div>
    );
};

export default Payment;