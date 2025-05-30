import { ArrowDownLeft, ArrowRight, ArrowUpRight, Calendar, ChevronLeft, ChevronRight, Database, ExternalLink, Filter, RefreshCw, Search, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { getAllTransactions, getExplorerUrl } from './EtherscanService';
import './TransactionHistory.css';

function TransactionHistory({ currentAddress, network }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [directionFilter, setDirectionFilter] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 6;

  // Función para obtener transacciones con useCallback para memoización
  const fetchTransactions = useCallback(async () => {
    if (!currentAddress) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const txs = await getAllTransactions(currentAddress, network);
      setTransactions(txs);
    } catch (err) {
      console.error('Error al obtener transacciones:', err);
      setError('No se pudieron cargar las transacciones. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }, [currentAddress, network]);

  // Cargar transacciones al montar o cambiar dirección/red
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Resetear página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter, directionFilter]);

  // Formatear fecha
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Determinar si la transacción es entrante o saliente
  const isIncoming = (tx) => {
    return tx.to?.toLowerCase() === currentAddress?.toLowerCase();
  };

  // Filtrar transacciones
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      (tx.hash?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (tx.from?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (tx.to?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    let matchesTypeFilter = true;
    if (filter === 'tokens' && !tx.isToken) matchesTypeFilter = false;
    if (filter === 'eth' && tx.isToken) matchesTypeFilter = false;
    
    let matchesDirectionFilter = true;
    if (directionFilter === 'received' && !isIncoming(tx)) matchesDirectionFilter = false;
    if (directionFilter === 'sent' && isIncoming(tx)) matchesDirectionFilter = false;
    
    return matchesSearch && matchesTypeFilter && matchesDirectionFilter;
  });

  // Ordenar transacciones por timestamp (más recientes primero)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => b.timestamp - a.timestamp);
  
  // Calcular total de páginas
  const totalPages = Math.max(1, Math.ceil(sortedTransactions.length / itemsPerPage));
  
  // Obtener transacciones de la página actual
  const currentTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Cambiar página
  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Estadísticas rápidas
  const totalReceived = transactions.filter(tx => isIncoming(tx)).length;
  const totalSent = transactions.filter(tx => !isIncoming(tx)).length;

  return (
    <div className="transaction-history-container">
      <div className="transaction-history">
        {/* Header mejorado */}
        <div className="transaction-header">
          <div className="header-main">
            <div className="header-title">
              <Database size={24} className="header-icon" />
              <h1>Historial de Transacciones</h1>
            </div>
            <button 
              onClick={fetchTransactions} 
              className="refresh-btn"
              disabled={loading}
              title="Actualizar transacciones"
            >
              <RefreshCw size={18} className={loading ? "refreshing" : ""} />
              <span>Actualizar</span>
            </button>
          </div>
          
          {/* Estadísticas rápidas */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon received">
                <ArrowDownLeft size={18} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{totalReceived}</span>
                <span className="stat-label">Recibidas</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon sent">
                <ArrowUpRight size={18} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{totalSent}</span>
                <span className="stat-label">Enviadas</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon total">
                <TrendingUp size={18} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{transactions.length}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filtros mejorados */}
        <div className="filters-section">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar por hash de transacción o dirección..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <div className="filter-group">
              <label className="filter-label">
                <Filter size={16} />
                Tipo
              </label>
              <select 
                className="filter-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Todas</option>
                <option value="eth">Solo ETH</option>
                <option value="tokens">Solo Tokens</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">
                <TrendingDown size={16} />
                Dirección
              </label>
              <select 
                className="filter-select"
                value={directionFilter}
                onChange={(e) => setDirectionFilter(e.target.value)}
              >
                <option value="all">Todas</option>
                <option value="received">Recibidas</option>
                <option value="sent">Enviadas</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="transaction-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <h3>Cargando transacciones...</h3>
              <p>Obteniendo datos desde la blockchain</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <h3>Error al cargar transacciones</h3>
              <p>{error}</p>
              <button onClick={fetchTransactions} className="retry-btn">
                <RefreshCw size={16} />
                Intentar de nuevo
              </button>
            </div>
          ) : currentTransactions.length === 0 ? (
            <div className="empty-state">
              <Database size={48} className="empty-icon" />
              <h3>No hay transacciones</h3>
              <p>No se encontraron transacciones con los filtros aplicados</p>
            </div>
          ) : (
            <div className="transaction-grid">
              {currentTransactions.map((tx, index) => (
                <div key={`${tx.hash}-${index}`} className={`transaction-card ${isIncoming(tx) ? 'incoming' : 'outgoing'}`}>
                  <div className="card-header">
                    <div className="transaction-status">
                      <div className={`status-indicator ${isIncoming(tx) ? 'received' : 'sent'}`}>
                        {isIncoming(tx) ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                        <span>{isIncoming(tx) ? 'Recibida' : 'Enviada'}</span>
                      </div>
                      <div className="transaction-date">
                        <Calendar size={14} />
                        <span>{formatDate(tx.timestamp)}</span>
                      </div>
                    </div>
                    
                    <div className="card-badges">
                      <span className="network-badge">{tx.network}</span>
                      {tx.isToken && <span className="token-badge">Token</span>}
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="transaction-flow">
                      <div className="address-info">
                        <span className="address-label">De</span>
                        <div className="address-container">
                          <Wallet size={14} />
                          <span className="address-text">
                            {tx.from?.slice(0, 6)}...{tx.from?.slice(-4)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flow-arrow">
                        <ArrowRight size={20} />
                      </div>
                      
                      <div className="address-info">
                        <span className="address-label">Para</span>
                        <div className="address-container">
                          <Wallet size={14} />
                          <span className="address-text">
                            {tx.to?.slice(0, 6)}...{tx.to?.slice(-4)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="transaction-amount">
                      <span className="amount-value">
                        {parseFloat(tx.amount).toFixed(6)} {tx.isToken ? tx.tokenSymbol : 'ETH'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    <div className="hash-info">
                      <span className="hash-label">Hash de transacción</span>
                      <a
                        href={getExplorerUrl(tx.network, tx.hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hash-link"
                      >
                        <span>{tx.hash?.slice(0, 10)}...{tx.hash?.slice(-6)}</span>
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Paginación mejorada */}
        {totalPages > 1 && (
          <div className="pagination-wrapper">
            <div className="pagination">
              <button 
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <ChevronLeft size={18} />
                <span>Anterior</span>
              </button>
              
              <div className="pagination-info">
                <span>Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong></span>
                <span className="results-count">
                  {sortedTransactions.length} transaccione{sortedTransactions.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <button 
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                <span>Siguiente</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionHistory;