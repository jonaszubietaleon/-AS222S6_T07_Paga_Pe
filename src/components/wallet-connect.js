"use client"

import { useState } from "react"

const WalletConnect = ({ connectWallet, onClose, isOpen }) => {
  const [isConnecting, setIsConnecting] = useState(false)

  if (!isOpen) return null

  const handleConnect = async (walletType) => {
    setIsConnecting(true)
    try {
      if (walletType === "metamask") {
        const success = await connectWallet()
        if (success) {
          onClose()
        }
      }
    } catch (error) {
      console.error("Error conectando wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const wallets = [
    {
      name: "MetaMask",
      description: "Extensión de navegador",
      icon: (
        <svg viewBox="0 0 212 189" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M176.897 3.84607L105.803 62.163L123.429 14.9478L176.897 3.84607Z" fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M35.1028 3.84607L105.803 62.1631L88.5706 14.9478L35.1028 3.84607Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M153.049 128.19L138.714 155.426L171.616 164.092L180.924 128.262L153.049 128.19Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M31.0757 128.262L40.3839 164.092L73.2856 155.426L58.951 128.19L31.0757 128.262Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M73.5274 78.1016L63.0625 92.3636L105.935 94.7266L105.666 48.6523L73.5274 78.1016Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M138.472 78.1016L106.197 48.5L105.935 94.7266L148.937 92.3636L138.472 78.1016Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M73.2856 155.426L94.1587 145.499L77.115 128.332L73.2856 155.426Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M117.841 145.499L138.714 155.426L134.885 128.332L117.841 145.499Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M138.714 155.426L117.841 145.499L120.637 163.18L120.429 164.006L138.714 155.426Z" fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M73.2856 155.426L91.5706 164.006L91.4302 163.18L94.1587 145.499L73.2856 155.426Z" fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M91.6381 120.334L77.1875 115.234L86.3556 109.573L91.6381 120.334Z" fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M120.362 120.334L125.644 109.573L134.812 115.234L120.362 120.334Z" fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M73.2856 155.426L77.1875 128.19L58.951 128.262L73.2856 155.426Z" fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M134.812 128.19L138.714 155.426L153.049 128.262L134.812 128.19Z" fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M148.937 92.3636L105.935 94.7266L111.362 120.334L112.17 109.076L112.028 109.573L148.937 92.3636Z" fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M63.0625 92.3636L99.9716 109.573L99.8296 109.076L100.638 120.334L105.935 94.7266L63.0625 92.3636Z" fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M63.0625 92.3636L77.1875 115.234L63.0625 92.3636Z" fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M148.937 92.3636L134.812 115.234L148.937 92.3636Z" fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M100.638 120.334L94.1587 145.499L91.6381 120.334H100.638Z" fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M111.362 120.334L117.841 145.499L120.362 120.334H111.362Z" fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M117.841 145.499L111.362 120.334L112.17 109.076L120.429 164.006L117.841 145.499Z" fill="#C0AD9E" stroke="#C0AD9E" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M91.6381 120.334L94.1587 145.499L91.5706 164.006L99.8296 109.076L91.6381 120.334Z" fill="#C0AD9E" stroke="#C0AD9E" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M120.429 164.006L125.644 109.573L120.362 120.334L117.841 145.499L120.429 164.006Z" fill="#161616" stroke="#161616" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M86.3556 109.573L91.5706 164.006L94.1587 145.499L91.6381 120.334L86.3556 109.573Z" fill="#161616" stroke="#161616" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M105.935 94.7266L105.803 62.1631L123.429 14.9478L105.935 94.7266Z" fill="#763D16" stroke="#763D16" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M35.1028 3.84607L14.9478 60.4896L40.3839 164.092L58.951 128.262L35.1028 3.84607Z" fill="#763D16" stroke="#763D16" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M176.897 3.84607L153.049 128.262L171.616 164.092L197.052 60.4896L176.897 3.84607Z" fill="#763D16" stroke="#763D16" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M105.803 62.1631L88.5706 14.9478L105.803 62.1631Z" fill="#763D16" stroke="#763D16" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      type: "metamask",
      available: true,
      gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
    },
    {
      name: "WalletConnect",
      description: "Conexión de wallet móvil",
      icon: (
        <svg viewBox="0 0 387 237" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M78.5 118.5C78.5 66.8 120.8 24.5 172.5 24.5H214.5C266.2 24.5 308.5 66.8 308.5 118.5C308.5 170.2 266.2 212.5 214.5 212.5H172.5C120.8 212.5 78.5 170.2 78.5 118.5Z" fill="#3B99FC"/>
          <path d="M172.5 24.5C120.8 24.5 78.5 66.8 78.5 118.5C78.5 170.2 120.8 212.5 172.5 212.5H214.5C266.2 212.5 308.5 170.2 308.5 118.5C308.5 66.8 266.2 24.5 214.5 24.5H172.5Z" stroke="white" strokeWidth="24" strokeMiterlimit="10"/>
          <path d="M193.5 118.5C193.5 92.3 214.3 71.5 240.5 71.5H308.5" stroke="white" strokeWidth="24" strokeMiterlimit="10"/>
          <path d="M193.5 118.5C193.5 144.7 214.3 165.5 240.5 165.5H308.5" stroke="white" strokeWidth="24" strokeMiterlimit="10"/>
        </svg>
      ),
      type: "walletconnect",
      available: false,
      gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
    },
    {
      name: "Coinbase Wallet",
      description: "Extensión de Coinbase",
      icon: (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#0052FF"/>
          <path d="M22.5 16.5H9.5V15.5H22.5V16.5Z" fill="white"/>
          <path d="M16 21C13.2386 21 11 18.7614 11 16C11 13.2386 13.2386 11 16 11C18.7614 11 21 13.2386 21 16C21 18.7614 18.7614 21 16 21Z" fill="white"/>
        </svg>
      ),
      type: "coinbase",
      available: false,
      gradient: "linear-gradient(135deg, #0052FF 0%, #0039B3 100%)"
    },
    {
      name: "Ledger",
      description: "Wallet de hardware",
      icon: (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#000000"/>
          <path d="M22.5 13.5H9.5V18.5H22.5V13.5Z" fill="white"/>
          <path d="M19.5 10.5H12.5V21.5H19.5V10.5Z" fill="white"/>
        </svg>
      ),
      type: "ledger",
      available: false,
      gradient: "linear-gradient(135deg, #000000 0%, #333333 100%)"
    }
  ]

  const features = [
    {
      title: "Gestión Segura de Activos Digitales",
      description: "Las wallets te permiten almacenar, enviar, recibir e interactuar de forma segura con activos digitales como criptomonedas y NFTs.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#f2c94c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8V12L15 15" stroke="#f2c94c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      gradient: "linear-gradient(135deg, #002a5a 0%, #003d7a 100%)"
    },
    {
      title: "Autenticación Web3",
      description: "En lugar de crear nuevas cuentas y contraseñas para cada sitio web, simplemente conecta tu wallet para autenticarte de forma segura.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="#f2c94c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      gradient: "linear-gradient(135deg, #002a5a 0%, #003d7a 100%)"
    },
    {
      title: "Identidad Descentralizada",
      description: "Tu wallet sirve como tu identidad descentralizada en todas las aplicaciones Web3 sin depender de proveedores centralizados.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="#f2c94c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 20C6 17.7909 7.79086 16 10 16H14C16.2091 16 18 17.7909 18 20" stroke="#f2c94c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      gradient: "linear-gradient(135deg, #002a5a 0%, #003d7a 100%)"
    }
  ]

  return (
    <div className="wallet-modal-overlay">
      <div className="wallet-modal-container">
        <div className="wallet-modal">
          {/* Botón de cerrar */}
          <button onClick={onClose} className="wallet-modal-close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="#f2c94c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="#f2c94c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Contenido principal */}
          <div className="wallet-modal-content">
            {/* Panel izquierdo - Wallets */}
            <div className="wallet-selection-panel">
              <div className="wallet-header">
                <h2>Conectar Wallet</h2>
                <p>Selecciona tu proveedor de wallet preferido</p>
              </div>

              <div className="wallets-grid">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => wallet.available && handleConnect(wallet.type)}
                    disabled={!wallet.available}
                    className={`wallet-card ${!wallet.available ? 'disabled' : ''}`}
                  >
                    <div className="wallet-icon-container" style={{ background: wallet.gradient }}>
                      {wallet.icon}
                    </div>
                    <div className="wallet-info">
                      <h3>{wallet.name}</h3>
                      <p>{wallet.description}</p>
                    </div>
                    {!wallet.available && (
                      <div className="coming-soon-badge">Próximamente</div>
                    )}
                  </button>
                ))}
              </div>

              {isConnecting && (
                <div className="connection-status">
                  <div className="spinner"></div>
                  <span>Esperando conexión...</span>
                </div>
              )}
            </div>

            {/* Panel derecho - Características */}
            <div className="wallet-features-panel">
              <div className="features-header">
                <h3>¿Por qué Conectar una Wallet?</h3>
                <p>Tu puerta de entrada a las aplicaciones descentralizadas</p>
              </div>

              <div className="features-list">
                {features.map((feature, index) => (
                  <div key={index} className="feature-card" style={{ background: feature.gradient }}>
                    <div className="feature-icon">
                      {feature.icon}
                    </div>
                    <div className="feature-content">
                      <h4>{feature.title}</h4>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="wallet-tip">
                <div className="tip-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#f2c94c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12" stroke="#f2c94c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8H12.01" stroke="#f2c94c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="tip-content">
                  <h4>¿Nuevo en Web3?</h4>
                  <p>Recomendamos MetaMask como una wallet segura y fácil de usar para principiantes. Está disponible como extensión de navegador y aplicación móvil.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletConnect