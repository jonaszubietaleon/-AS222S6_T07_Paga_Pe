import { useCallback, useState } from 'react';
import './Dashboard.css';

function Dashboard({ account, balance, network, updateBalance, setCurrentPage }) {
    const [showToast, setShowToast] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Función de actualización de saldo con useCallback
    const handleRefreshBalance = useCallback(async () => {
        if (!updateBalance || !account) return;
        
        setIsRefreshing(true);
        try {
            await updateBalance(account);
        } catch (error) {
            console.error("Error al actualizar saldo desde Dashboard:", error);
        } finally {
            setIsRefreshing(false);
        }
    }, [updateBalance, account]);
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(account);
        setShowToast(true);
        
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };
    
    // Navigation functions
    const navigateToTransactions = () => {
        setCurrentPage('transactions');
    };
    
    const navigateToHistory = () => {
        setCurrentPage('history');
    };
    
    const navigateToContacts = () => {
        setCurrentPage('contacts');
    };
    
    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Mi Billetera</h1>
                <div className="connection-status">
                    <div className={`status-indicator ${network ? 'connected' : 'disconnected'}`}></div>
                    <span className="status-text">
                        {network ? `Conectado a ${network}` : 'Desconectado'}
                    </span>
                </div>
            </div>

            {/* Balance Card Principal */}
            <div className="balance-card main-balance">
                <div className="balance-header">
                    <h2>Balance Total</h2>
                    <button 
                        className="refresh-btn"
                        onClick={handleRefreshBalance}
                        disabled={isRefreshing}
                        title="Actualizar saldo"
                    >
                        <i className={`fa fa-refresh ${isRefreshing ? 'rotating' : ''}`}></i>
                    </button>
                </div>
                <div className="balance-amount">
                    <span className="balance-number">{balance}</span>
                    <span className="balance-currency">ETH</span>
                </div>
                <div className="balance-subtitle">Ethereum</div>
            </div>
            
            {/* Account Info Card */}
            <div className="account-card">
                <div className="card-header">
                    <h3>Tu Dirección</h3>
                </div>
                <div className="address-container">
                    <div className="address-display">
                        <span className="address-text">{account}</span>
                    </div>
                    <button className="copy-button" onClick={copyToClipboard}>
                        <i className="fa fa-copy"></i>
                        <span>Copiar</span>
                    </button>
                </div>
            </div>
            
            {/* Quick Actions Grid */}
            <div className="actions-section">
                <h3 className="section-title">Acciones Rápidas</h3>
                <div className="actions-grid">
                    <button className="action-card" onClick={navigateToTransactions}>
                        <div className="action-icon send">
                            <i className="fa fa-paper-plane"></i>
                        </div>
                        <div className="action-content">
                            <h4>Enviar ETH</h4>
                            <p>Transferir fondos</p>
                        </div>
                    </button>
                    
                    <button className="action-card" onClick={navigateToHistory}>
                        <div className="action-icon history">
                            <i className="fa fa-history"></i>
                        </div>
                        <div className="action-content">
                            <h4>Historial</h4>
                            <p>Ver transacciones</p>
                        </div>
                    </button>
                    
                    <button className="action-card" onClick={navigateToContacts}>
                        <div className="action-icon contacts">
                            <i className="fa fa-address-book"></i>
                        </div>
                        <div className="action-content">
                            <h4>Contactos</h4>
                            <p>Gestionar direcciones</p>
                        </div>
                    </button>
                </div>
            </div>
            
            {/* Network Details Card */}
            <div className="network-details">
                <h3 className="section-title">Detalles de Conexión</h3>
                <div className="details-grid">
                    <div className="detail-item">
                        <span className="detail-label">Red:</span>
                        <span className="detail-value">{network || 'No conectado'}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Dirección corta:</span>
                        <span className="detail-value">
                            {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'No conectado'}
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Toast Notification */}
            {showToast && (
                <div className="toast-notification">
                    <div className="toast-content">
                        <i className="fa fa-check-circle"></i>
                        <span>¡Dirección copiada al portapapeles!</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;