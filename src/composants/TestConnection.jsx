// TestConnection.jsx - Version corrigée
import React, { useState, useEffect } from 'react';

function TestConnection() {
    const [status, setStatus] = useState('🔍 Test...');
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState(null);

    const testConnection = async () => {
        setLoading(true);
        setStatus('🔍 Test en cours...');
        
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5275';
            console.log('🧪 Testing:', `${API_URL}/api/test`);
            
            const response = await fetch(`${API_URL}/api/test`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                // ❌ NE PAS utiliser credentials pour les tests CORS
                // credentials: 'include'
            });
            
            console.log('📡 Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                setStatus('✅ API Connectée');
                setDetails(data);
                console.log('✅ API Response:', data);
            } else {
                const errorText = await response.text();
                setStatus(`❌ Erreur ${response.status}`);
                setDetails({ error: errorText });
                console.error('❌ API Error:', errorText);
            }
        } catch (error) {
            setStatus('❌ Hors ligne');
            setDetails({ error: error.message });
            console.error('🌐 Network Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            background: 'white', 
            padding: '15px', 
            borderRadius: '8px', 
            border: '1px solid #ddd',
            fontSize: '14px',
            maxWidth: '350px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <strong>Statut API:</strong>
                <span style={{ 
                    color: status.includes('✅') ? 'green' : 
                           status.includes('❌') ? 'red' : 'orange',
                    fontWeight: 'bold',
                    fontSize: '12px'
                }}>
                    {status}
                </span>
            </div>
            
            {details && (
                <div style={{ marginTop: '8px', fontSize: '11px', background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                    <div><strong>Message:</strong> {details.message || details.error}</div>
                    <div><strong>Time:</strong> {details.timestamp ? new Date(details.timestamp).toLocaleTimeString() : 'N/A'}</div>
                </div>
            )}
            
            <button 
                onClick={testConnection}
                style={{
                    marginTop: '10px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    backgroundColor: loading ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    width: '100%'
                }}
                disabled={loading}
            >
                {loading ? '🔄 Test en cours...' : '🧪 Tester la connexion'}
            </button>
        </div>
    );
}

export default TestConnection;