import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import './App.css';

import Home from './components/home';
import Dashboard from './components/Dashboard/Dashboard';
import TransactionHistory from './components/History/TransactionHistory';
import ContactManager from './components/Contact/ContactManager';
import TransactionForm from './components/TransactionForm/TransactionForm';
import Navbar from './components/Navbar/Navbar';
import Notification from './components/Notification/Notification';
import Chatbot from './components/Chatbot/Chatbot';

function App() {
  // Estados de la aplicaciónes
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [network, setNetwork] = useState('');
  const [balance, setBalance] = useState('0');
  const [contacts, setContacts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'dashboard', 'transactions', 'history', 'contacts'
  const [menuOpen, setMenuOpen] = useState(false);
  const [isUpdatingBalance, setIsUpdatingBalance] = useState(false);

  // Función para mostrar notificaciones
  const showNotification = useCallback((message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  }, []);

  // Mapear chainId a nombre de red
  const handleNetworkName = useCallback((chainId) => {
    const networks = {
      '0x1': 'ETH Mainnet',
      '0x4268': 'Holesky',
      '0xaa36a7': 'ETH Sepolia',
      '0x5': 'ETH Goerli',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Polygon Mumbai'
    };
    setNetwork(networks[chainId] || 'Red Desconocida');
  }, []);

  // Actualizar balance
  const updateBalance = useCallback(async (address) => {
    if (!provider || isUpdatingBalance || !address) return false;
    
    setIsUpdatingBalance(true);
    try {
      const balance = await provider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));
      return true;
    } catch (error) {
      console.error("Error actualizando balance:", error);
      showNotification('Error al actualizar el saldo', 'error');
      return false;
    } finally {
      setIsUpdatingBalance(false);
    }
  }, [provider, isUpdatingBalance, showNotification]);

  // Manejar cambio de red
  const handleChainChanged = useCallback(async (chainId) => {
    try {
      setIsUpdatingBalance(true);
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(newProvider);
      
      const newSigner = newProvider.getSigner();
      setSigner(newSigner);
      
      handleNetworkName(chainId);
      
      if (account) {
        try {
          await updateBalance(account);
          showNotification(`Red cambiada a ${network}`, 'success');
        } catch (error) {
          console.error("Error actualizando balance:", error);
        }
      }
    } catch (error) {
      console.error("Error actualizando después del cambio de red:", error);
      showNotification('Error al actualizar después del cambio de red', 'error');
    } finally {
      setIsUpdatingBalance(false);
    }
  }, [account, network, showNotification, handleNetworkName, updateBalance]);
  
  // Manejar cambio de cuenta
  const handleAccountsChanged = useCallback((accounts) => {
    if (accounts.length === 0) {
      setAccount('');
      setSigner(null);
      setCurrentPage('home');
    } else {
      setAccount(accounts[0]);
      updateBalance(accounts[0]);
    }
  }, [updateBalance]);

  // Limpiar event listeners
  useEffect(() => {
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [handleChainChanged, handleAccountsChanged]);

  // Cargar datos guardados al iniciar
  useEffect(() => {
    if (account) {
      loadTransactionHistory(account);
      loadContacts();
    }
  }, [account]);

  // Conectar wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        showNotification('Por favor instala MetaMask para usar esta aplicación', 'error');
        return false;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const signer = provider.getSigner();
      setSigner(signer);
      
      const address = await signer.getAddress();
      setAccount(address);
      
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      handleNetworkName(chainId);
      
      await updateBalance(address);
      
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      setCurrentPage('dashboard');
      showNotification('Wallet conectada correctamente', 'success');
      return true;
    } catch (error) {
      showNotification('Error al conectar con MetaMask: ' + error.message, 'error');
      return false;
    }
  };
  
  // Desconectar wallet
  const disconnectWallet = () => {
    if (window.ethereum) {
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
    
    setAccount('');
    setProvider(null);
    setSigner(null);
    setNetwork('');
    setBalance('0');
    setCurrentPage('home');
    showNotification('Sesión cerrada correctamente', 'success');
  };
  
  // Cargar historial de transacciones
  const loadTransactionHistory = async (address) => {
    try {
      const savedTransactions = localStorage.getItem(`transactions_${address}`);
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
    }
  };
  
  // Cargar contactos
  const loadContacts = () => {
    try {
      const savedContacts = localStorage.getItem('contacts');
      if (savedContacts) {
        setContacts(JSON.parse(savedContacts));
      }
    } catch (error) {
      console.error("Error cargando contactos:", error);
    }
  };
  
  // Agregar contacto
  const addContact = (contact) => {
    try {
      const newContacts = [...contacts, contact];
      setContacts(newContacts);
      localStorage.setItem('contacts', JSON.stringify(newContacts));
      showNotification('Contacto agregado exitosamente', 'success');
    } catch (error) {
      console.error("Error agregando contacto:", error);
      showNotification('Error al agregar contacto', 'error');
    }
  };
  
  // Eliminar contacto
  const removeContact = (addressToRemove) => {
    try {
      const updatedContacts = contacts.filter(contact => contact.address !== addressToRemove);
      setContacts(updatedContacts);
      localStorage.setItem('contacts', JSON.stringify(updatedContacts));
      showNotification('Contacto eliminado exitosamente', 'success');
    } catch (error) {
      console.error("Error eliminando contacto:", error);
      showNotification('Error al eliminar contacto', 'error');
    }
  };
  
  // Enviar transacción
  const sendTransaction = async (transactionData) => {
    try {
      if (!signer) throw new Error('No hay una billetera conectada');
      
      const { recipient, amount } = transactionData;
      const amountInWei = ethers.utils.parseEther(amount.toString());
      
      const tx = await signer.sendTransaction({
        to: recipient,
        value: amountInWei
      });
      
      await tx.wait();
      
      const newTransaction = {
        hash: tx.hash,
        from: account,
        to: recipient,
        amount: amount,
        timestamp: Date.now(),
        network: network
      };
      
      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      localStorage.setItem(`transactions_${account}`, JSON.stringify(updatedTransactions));
      
      await updateBalance(account);
      showNotification('Transacción completada con éxito', 'success');
      return true;
    } catch (error) {
      showNotification('Error en la transacción: ' + error.message, 'error');
      return false;
    }
  };
  
  // Cambiar de red
  const switchNetwork = useCallback(async (chainId, networkParams) => {
    try {
      if (!window.ethereum) throw new Error("MetaMask no está instalado");
      
      setIsUpdatingBalance(true);
      
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        });
      } catch (switchError) {
        if (switchError.code === 4902 && networkParams) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkParams],
          });
        } else {
          throw switchError;
        }
      }
      
      handleNetworkName(chainId);
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(newProvider);
      
      const newSigner = newProvider.getSigner();
      setSigner(newSigner);
      
      if (account) {
        try {
          await updateBalance(account);
        } catch (error) {
          console.error("Error actualizando balance:", error);
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error al cambiar de red:", error);
      showNotification('Error cambiando de red: ' + error.message, 'error');
      return false;
    } finally {
      setIsUpdatingBalance(false);
    }
  }, [account, handleNetworkName, showNotification, updateBalance]);

  // Toggle menú móvil
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Cambiar página
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  // Renderizar página actual
  const renderCurrentPage = () => {
    if (!account && currentPage !== 'home') {
      return <Home connectWallet={connectWallet} setCurrentPage={handlePageChange} />;
    }

    switch (currentPage) {
      case 'home':
        return <Home connectWallet={connectWallet} setCurrentPage={handlePageChange} />;
      case 'dashboard':
        return <Dashboard 
                account={account} 
                balance={balance} 
                network={network}
                updateBalance={updateBalance}
                setCurrentPage={handlePageChange}
              />;
      case 'transactions':
        return <TransactionForm 
                contacts={contacts} 
                sendTransaction={sendTransaction} 
              />;
      case 'history':
          return <TransactionHistory 
                  currentAddress={account}
                  network={network}
                />;
      case 'contacts':
        return <ContactManager 
                contacts={contacts} 
                addContact={addContact} 
                removeContact={removeContact}
              />;
      default:
        return <Dashboard 
                account={account} 
                balance={balance} 
                network={network}
                updateBalance={updateBalance}
                setCurrentPage={handlePageChange}
              />;
    }
  };

  return (
    <div className="app">
      {account && (
        <Navbar 
          account={account} 
          setCurrentPage={handlePageChange} 
          currentPage={currentPage}
          network={network}
          switchNetwork={switchNetwork}
          disconnectWallet={disconnectWallet}
          menuOpen={menuOpen}
          toggleMenu={toggleMenu}
          updateBalance={updateBalance}
        />
      )}
      
      <main className={`main-content ${!account ? 'full-height' : ''}`}>
        {renderCurrentPage()}
      </main>
      
      {notification.show && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <Chatbot />
    </div>
  );
}

export default App;
