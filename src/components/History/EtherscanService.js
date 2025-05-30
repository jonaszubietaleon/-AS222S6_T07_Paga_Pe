// EtherscanService.js
// Servicio para interactuar con la API de Etherscan

const API_KEY = 'QSV75QAAP33N3AVVIB925STUEXKV4SBF3J';

// Mapa de las URLs base de la API según la red
const API_URLS = {
  'ETH Mainnet': 'https://api.etherscan.io/api',
  'Holesky': 'https://api-holesky.etherscan.io/api',
  'ETH Sepolia': 'https://api-sepolia.etherscan.io/api',
  'ETH Goerli': 'https://api-goerli.etherscan.io/api',
  'Polygon Mainnet': 'https://api.polygonscan.com/api',
  'Polygon Mumbai': 'https://api-testnet.polygonscan.com/api',
  'Red Desconocida': 'https://api.etherscan.io/api', // Por defecto, usamos Ethereum Mainnet
};

// Mapa de los prefijos para ver transacciones según la red
const EXPLORER_URLS = {
  'ETH Mainnet': 'https://etherscan.io',
  'Holesky': 'https://holesky.etherscan.io',
  'ETH Sepolia': 'https://sepolia.etherscan.io',
  'ETH Goerli': 'https://goerli.etherscan.io',
  'Polygon Mainnet': 'https://polygonscan.com',
  'Polygon Mumbai': 'https://mumbai.polygonscan.com',
  'Red Desconocida': 'https://etherscan.io',
};

// Obtener la URL base de la API según la red
const getApiUrl = (network) => {
  return API_URLS[network] || API_URLS['Red Desconocida'];
};

// Obtener la URL del explorador según la red
export const getExplorerUrl = (network, hash) => {
  const baseUrl = EXPLORER_URLS[network] || EXPLORER_URLS['Red Desconocida'];
  return `${baseUrl}/tx/${hash}`;
};

/**
 * Obtiene las transacciones normales de una dirección
 * @param {string} address - La dirección a consultar
 * @param {string} network - La red a consultar (ETH Mainnet, Holesky, etc.)
 * @param {number} startBlock - Bloque inicial (opcional, por defecto 0)
 * @returns {Promise<Array>} - Lista de transacciones
 */
export const getAddressTransactions = async (address, network, startBlock = 0) => {
  if (!address) return [];

  const apiUrl = getApiUrl(network);
  const url = `${apiUrl}?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=99999999&sort=desc&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === '1' && data.result) {
      // Mapear los resultados al formato esperado por nuestra aplicación
      return data.result.map(tx => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        amount: (parseInt(tx.value) / 1e18).toString(), // Convertir de wei a ETH
        timestamp: parseInt(tx.timeStamp) * 1000, // Convertir a milisegundos
        network: network,
        gasUsed: tx.gasUsed,
        gasPrice: tx.gasPrice,
        isError: tx.isError === '1',
        txreceipt_status: tx.txreceipt_status
      }));
    }
    return [];
  } catch (error) {
    console.error('Error obteniendo transacciones de Etherscan:', error);
    throw error;
  }
};

/**
 * Obtiene las transacciones de token ERC-20 de una dirección
 * @param {string} address - La dirección a consultar
 * @param {string} network - La red a consultar
 * @returns {Promise<Array>} - Lista de transacciones de tokens
 */
export const getAddressTokenTransfers = async (address, network) => {
  if (!address) return [];

  const apiUrl = getApiUrl(network);
  const url = `${apiUrl}?module=account&action=tokentx&address=${address}&sort=desc&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === '1' && data.result) {
      // Mapear los resultados de tokens al formato esperado
      return data.result.map(tx => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        amount: (parseInt(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal))).toString(),
        timestamp: parseInt(tx.timeStamp) * 1000,
        network: network,
        tokenName: tx.tokenName,
        tokenSymbol: tx.tokenSymbol,
        contractAddress: tx.contractAddress,
        isToken: true
      }));
    }
    return [];
  } catch (error) {
    console.error('Error obteniendo transferencias de tokens de Etherscan:', error);
    throw error;
  }
};

/**
 * Obtiene todas las transacciones (normales y tokens) de una dirección
 * @param {string} address - La dirección a consultar
 * @param {string} network - La red a consultar
 * @returns {Promise<Array>} - Lista combinada de transacciones
 */
export const getAllTransactions = async (address, network) => {
  try {
    // Obtener ambos tipos de transacciones en paralelo
    const [normalTxs, tokenTxs] = await Promise.all([
      getAddressTransactions(address, network),
      getAddressTokenTransfers(address, network)
    ]);

    // Combinar ambos arrays y ordenar por timestamp (más recientes primero)
    const allTransactions = [...normalTxs, ...tokenTxs].sort((a, b) => b.timestamp - a.timestamp);
    
    return allTransactions;
  } catch (error) {
    console.error('Error obteniendo todas las transacciones:', error);
    throw error;
  }
};

// Creamos un objeto con todas las funciones exportadas
const EtherscanService = {
  getAddressTransactions,
  getAddressTokenTransfers,
  getAllTransactions,
  getExplorerUrl
};

// Exportamos el objeto como default
export default EtherscanService;