"use client"

import { useState, useEffect, useCallback } from "react"
import Swal from "sweetalert2"
import "./Navbar.css"

function Navbar({
  account,
  setCurrentPage,
  currentPage,
  network,
  switchNetwork,
  disconnectWallet,
  menuOpen,
  toggleMenu,
  updateBalance,
}) {
  const [showNetworkMenu, setShowNetworkMenu] = useState(false)
  const [isUpdatingBalance, setIsUpdatingBalance] = useState(false)

  const networks = [
    { name: "ETH Mainnet", chainId: "0x1", symbol: "ETH" },
    {
      name: "Holesky",
      chainId: "0x4268",
      symbol: "ETH",
      rpcUrl: "https://holesky.drpc.org",
      explorer: "https://holesky.etherscan.io",
    },
    { name: "ETH Sepolia", chainId: "0xaa36a7", symbol: "ETH" },
    { name: "ETH Goerli", chainId: "0x5", symbol: "ETH" },
  ]

  // Función para actualizar el saldo con useCallback - SIN notificaciones de error
  const refreshBalance = useCallback(async () => {
    if (!updateBalance || !account) return

    setIsUpdatingBalance(true)
    try {
      // Ejecutar la actualización del saldo sin mostrar notificaciones de error
      await updateBalance(account, false)
    } catch (error) {
      console.error("Error al actualizar saldo:", error)
      // NO mostrar notificación aquí
    } finally {
      setIsUpdatingBalance(false)
    }
  }, [updateBalance, account])

  // Efecto para actualizar el saldo cuando cambia la red
  useEffect(() => {
    if (network && account && !isUpdatingBalance && updateBalance) {
      refreshBalance()
    }
  }, [network, account, updateBalance, isUpdatingBalance, refreshBalance])

  const toggleNetworkMenu = () => {
    setShowNetworkMenu(!showNetworkMenu)
  }

  // Función para manejar el cambio de red con SweetAlert2
  const handleNetworkSwitch = async (chainId) => {
    try {
      // Get the network information
      const networkInfo = networks.find((net) => net.chainId === chainId)

      // Mostrar loading con SweetAlert2
      Swal.fire({
        title: "Cambiando red...",
        text: `Cambiando a ${networkInfo?.name || "nueva red"}`,
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      // Switch network with additional parameters for Holesky
      if (networkInfo?.name === "Holesky") {
        await switchNetwork(chainId, {
          chainName: "Holesky",
          rpcUrls: [networkInfo.rpcUrl || "https://holesky.drpc.org"],
          nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
          },
          blockExplorerUrls: [networkInfo.explorer || "https://holesky.etherscan.io"],
        })
      } else {
        await switchNetwork(chainId)
      }

      // Cerrar el loading y mostrar éxito
      Swal.fire({
        title: "¡Éxito!",
        text: `Red cambiada a ${networkInfo?.name}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (error) {
      console.error("Error en handleNetworkSwitch:", error)

      Swal.fire({
        title: "Error",
        text: `Error al cambiar de red: ${error.message}`,
        icon: "error",
        confirmButtonText: "Entendido",
      })
    }
    setShowNetworkMenu(false)
  }

  // Get current network display name based on chainId
  const getCurrentNetworkName = () => {
    const currentNetwork = networks.find((net) => net.chainId === network || net.name === network)
    return currentNetwork?.name || network || "Red Desconocida"
  }

  return (
    <nav className="navbar">
      <div className="mobile-top-row">
        <div className="logo">
          <img src="/img/icono.png" alt="Logo PagaPe" className="nav-logo" />
          <span>PagaPe</span>
        </div>
        <div className="mobile-controls">
          <div className="account-mobile">
            {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "No conectado"}
          </div>
          <button className="menu-toggle" onClick={toggleMenu}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <div className={`navbar-content ${menuOpen ? "open" : ""}`}>
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
                    className={`network-item ${getCurrentNetworkName() === net.name ? "active" : ""}`}
                    onClick={() => handleNetworkSwitch(net.chainId)}
                  >
                    {net.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            className={`nav-item ${currentPage === "dashboard" ? "active" : ""}`}
            onClick={() => setCurrentPage("dashboard")}
          >
            Dashboard
          </div>
        </div>

        <div className="nav-menu">
          <div
            className={`nav-item ${currentPage === "transactions" ? "active" : ""}`}
            onClick={() => setCurrentPage("transactions")}
          >
            Enviar
          </div>
          <div
            className={`nav-item ${currentPage === "history" ? "active" : ""}`}
            onClick={() => setCurrentPage("history")}
          >
            Historial
          </div>
          <div
            className={`nav-item ${currentPage === "contacts" ? "active" : ""}`}
            onClick={() => setCurrentPage("contacts")}
          >
            Contactos
          </div>
        </div>

        <div className="navbar-right">
          <div className="account-logout">
            <div className="account desktop-only">
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "No conectado"}
            </div>
            <button className="logout-button" onClick={disconnectWallet}>
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
