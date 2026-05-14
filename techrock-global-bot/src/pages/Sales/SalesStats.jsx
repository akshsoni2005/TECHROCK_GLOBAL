import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './SalesStats.css';

const SalesStats = () => {
    const { clientId } = useParams(); // TR-7228
    const navigate = useNavigate();
    const fileInputRef = useRef(null); 
    
    const [businessName, setBusinessName] = useState('Loading...');
    const [products, setProducts] = useState([]); 
    const [newItem, setNewItem] = useState({ name: '', stock: '', price: '' });
    
    const [totalDbStock, setTotalDbStock] = useState(0);
    const [totalDbRevenue, setTotalDbRevenue] = useState(0);

    // --- FUNCTION: Fetch data from Django ---
    const fetchDashboardData = async () => {
        if (!clientId) return;
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/clients/get-by-crm/?crm_id=${clientId}`);
            if (res.data.status === 'success') {
                setTotalDbStock(res.data.stock_remaining); 
                setTotalDbRevenue(res.data.total_revenue);
                setBusinessName(res.data.business);

                setProducts([{
                    id: 'main_inv',
                    name: 'Current Stock',
                    stock: res.data.stock_remaining,
                    price: 500
                }]);
            }
        } catch (err) {
            console.error("Sync Error:", err);
        }
    };

    // --- EFFECT: Auto-Update every 5 seconds ---
    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 5000);
        return () => clearInterval(interval);
    }, [clientId]);

    // --- ACTION: Manual Add Stock ---
    const handleAddStock = async (e) => {
        e.preventDefault();
        const updatedStock = totalDbStock + Number(newItem.stock);
        try {
            await axios.post('http://127.0.0.1:8000/api/update-dashboard/', {
                crm_id: clientId,
                stock_remaining: updatedStock,
                total_revenue: totalDbRevenue
            });
            setNewItem({ name: '', stock: '', price: '' });
            fetchDashboardData();
        } catch (err) {
            alert("Update failed!");
        }
    };

    // --- ACTION: Record Sale (Sell 1 Unit) ---
    const handleRecordSale = async (productId, price) => {
        if (totalDbStock <= 0) return;
        const updatedStock = totalDbStock - 1;
        const updatedRev = totalDbRevenue + Number(price);

        try {
            await axios.post('http://127.0.0.1:8000/api/update-dashboard/', {
                crm_id: clientId,
                stock_remaining: updatedStock,
                total_revenue: updatedRev
            });
            fetchDashboardData();
        } catch (err) {
            console.error("Sale sync failed");
        }
    };

    return (
        <div className="stats-container">
            <header className="stats-header">
                <button className="back-btn" onClick={() => navigate(-1)}>← Hub</button>
                <h1>{businessName} ({clientId})</h1>
                <button className="action-btn bulk" onClick={() => fileInputRef.current.click()}>📤 Bulk Upload</button>
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
            </header>

            {/* ADD STOCK FORM */}
            <div className="add-stock-section" style={{ background: '#1a1f2b', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', marginBottom: '15px' }}>➕ Add New Stock Items</h3>
                <form onSubmit={handleAddStock} style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" placeholder="Product Name" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} required style={{ flex: 2, padding: '12px', background: '#2d3748', color: 'white', border: 'none', borderRadius: '6px' }} />
                    <input type="number" placeholder="Qty" value={newItem.stock} onChange={(e) => setNewItem({...newItem, stock: e.target.value})} required style={{ flex: 1, padding: '12px', background: '#2d3748', color: 'white', border: 'none', borderRadius: '6px' }} />
                    <input type="number" placeholder="Price" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} required style={{ flex: 1, padding: '12px', background: '#2d3748', color: 'white', border: 'none', borderRadius: '6px' }} />
                    <button type="submit" className="save-btn" style={{ background: '#10b981', color: 'white', padding: '0 25px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Save & Sync</button>
                </form>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <span>Total Inventory</span>
                    <h2 style={{color: '#60a5fa'}}>{totalDbStock} Units</h2>
                </div>
                <div className="stat-card">
                    <span>Total Revenue</span>
                    <h2 style={{color: '#10b981'}}>₹{totalDbRevenue.toLocaleString()}</h2>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr><th>Product Name</th><th>Stock Remaining</th><th>Unit Price</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.stock}</td>
                                <td>₹{p.price}</td>
                                <td>
                                    <button onClick={() => handleRecordSale(p.id, p.price)} className="sell-btn" style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>Sell 1 Unit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesStats;