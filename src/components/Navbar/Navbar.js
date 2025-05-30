import React, { useState, useEffect, useCallback } from 'react';
import './Navbar.css';

function Navbar({
    account,
    setCurrentPage,
    currentPage,
    network,
    switchNetwork,
    disconnectWallet,
    menuOpen,
    toggleMenu,
    updateBalance
}) {
    const [showNetworkMenu, setShowNetworkMenu] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '' });
    const [isUpdatingBalance, setIsUpdatingBalance] = useState(false);
    
    const networks = [
        { name: 'ETH Mainnet', chainId: '0x1', symbol: 'ETH' },
        { name: 'Holesky', chainId: '0x4268', symbol: 'ETH', rpcUrl: 'https://holesky.drpc.org', explorer: 'https://holesky.etherscan.io' }, // 17000
        { name: 'ETH Sepolia', chainId: '0xaa36a7', symbol: 'ETH' }, // 11155111
        { name: 'ETH Goerli', chainId: '0x5', symbol: 'ETH' }  // 5
    ];

    // Función para actualizar el saldo con useCallback - sin notificaciones
    const refreshBalance = useCallback(async () => {
        if (!updateBalance || !account) return;
        
        setIsUpdatingBalance(true);
        try {
            // Ejecutar la actualización del saldo sin mostrar notificación
            await updateBalance(account);
        } catch (error) {
            console.error("Error al actualizar saldo:", error);
        } finally {
            setIsUpdatingBalance(false);
        }
    }, [updateBalance, account]);

    // Efecto para actualizar el saldo cuando cambia la red
    useEffect(() => {
        if (network && account && !isUpdatingBalance && updateBalance) {
            refreshBalance();
        }
    }, [network, account, updateBalance, isUpdatingBalance, refreshBalance]);
    
    const toggleNetworkMenu = () => {
        setShowNetworkMenu(!showNetworkMenu);
    };
    
    // Función para manejar el cambio de red
    const handleNetworkSwitch = async (chainId) => {
        try {
            // Get the network information
            const networkInfo = networks.find(net => net.chainId === chainId);
            
            setNotification({
                show: true,
                message: `Cambiando a ${networkInfo?.name || 'nueva red'}...`
            });
            
            // Switch network with additional parameters for Holesky
            if (networkInfo?.name === 'Holesky') {
                await switchNetwork(chainId, {
                    chainName: 'Holesky',
                    rpcUrls: [networkInfo.rpcUrl || 'https://holesky.drpc.org'],
                    nativeCurrency: {
                        name: 'Ethereum',
                        symbol: 'ETH',
                        decimals: 18
                    },
                    blockExplorerUrls: [networkInfo.explorer || 'https://holesky.etherscan.io']
                });
            } else {
                await switchNetwork(chainId);
            }
            
            // El saldo se actualizará automáticamente gracias al useEffect
            // cuando la red cambie
        } catch (error) {
            console.error("Error en handleNetworkSwitch:", error);
            setNotification({
                show: true,
                message: `Error al cambiar de red: ${error.message}`
            });
            
            setTimeout(() => {
                setNotification({ show: false, message: '' });
            }, 5000);
        }
        
        setShowNetworkMenu(false);
    };
    
    // Get current network display name based on chainId
    const getCurrentNetworkName = () => {
        const currentNetwork = networks.find(net => 
            net.chainId === network || 
            net.name === network
        );
        return currentNetwork?.name || network || 'Red Desconocida';
    };
    
    return (
        <nav className="navbar">
            <div className="mobile-top-row">
                <div className="logo">
                    <img src="/img/icono.png" alt="Logo PagaPe" className="nav-logo" />
                    <span>PagaPe</span>
                </div>
                
                <div className="mobile-controls">
                    <div className="account-mobile">
                        {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'No conectado'}
                    </div>
                    <button className="menu-toggle" onClick={toggleMenu}>
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>
            
            <div className={`navbar-content ${menuOpen ? 'open' : ''}`}>
                <div className="navbar-left">
                    <div className="network-selector">
                        <button onClick={toggleNetworkMenu} className="network-button">
                            {getCurrentNetworkName()} ▼
                        </button>
                        {showNetworkMenu && (
                            <div className="network-menu">
                                {networks.map((net) => (
                                    <div
                                        key={net.chainId}
                                        className={`network-item ${getCurrentNetworkName() === net.name ? 'active' : ''}`}
                                        onClick={() => handleNetworkSwitch(net.chainId)}
                                    >
                                        {net.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div 
                        className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setCurrentPage('dashboard')}
                    >
                        Dashboard
                    </div>
                </div>
                
                <div className="nav-menu">
                    <div 
                        className={`nav-item ${currentPage === 'transactions' ? 'active' : ''}`}
                        onClick={() => setCurrentPage('transactions')}
                    >
                        Enviar
                    </div>
                    <div 
                        className={`nav-item ${currentPage === 'history' ? 'active' : ''}`}
                        onClick={() => setCurrentPage('history')}
                    >
                        Historial
                    </div>
                    <div 
                        className={`nav-item ${currentPage === 'contacts' ? 'active' : ''}`}
                        onClick={() => setCurrentPage('contacts')}
                    >
                        Contactos
                    </div>
                </div>
                
                <div className="navbar-right">
                    <div className="account-logout">
                        <div className="account desktop-only">
                            {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'No conectado'}
                        </div>
                        
                        <button className="logout-button" onClick={disconnectWallet}>
                            Salir
                        </button>
                        
                        {/* Solo mostramos notificaciones de cambio de red, no de actualización de saldo */}
                        {notification.show && notification.message.includes('Cambiando a') && (
                            <div className="network-notification">
                                {notification.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;