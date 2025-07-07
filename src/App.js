"use client"

import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import Swal from "sweetalert2"
import "./App.css"
import Home from "./components/home"
import Dashboard from "./components/Dashboard/Dashboard"
import TransactionHistory from "./components/History/TransactionHistory"
import ContactManager from "./components/Contact/ContactManager"
import TransactionForm from "./components/TransactionForm/TransactionForm"
import Navbar from "./components/Navbar/Navbar"
import Chatbot from "./components/Chatbot/Chatbot"

function App() {
  // Estados de la aplicación
  const [account, setAccount] = useState("")
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [network, setNetwork] = useState("")
  const [balance, setBalance] = useState("0")
  const [contacts, setContacts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [currentPage, setCurrentPage] = useState("home")
  const [menuOpen, setMenuOpen] = useState(false)
  const [isUpdatingBalance, setIsUpdatingBalance] = useState(false)

  // Función para mostrar notificaciones con SweetAlert2
  const showNotification = useCallback((message, type) => {
    const config = {
      title: type === "success" ? "¡Éxito!" : type === "error" ? "Error" : "Información",
      text: message,
      icon: type,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
      background: type === "success" ? "#d4edda" : type === "error" ? "#f8d7da" : "#d1ecf1",
      color: type === "success" ? "#155724" : type === "error" ? "#721c24" : "#0c5460",
    }

    Swal.fire(config)
  }, [])

  // Mapear chainId a nombre de red
  const handleNetworkName = useCallback((chainId) => {
    const networks = {
      "0x1": "ETH Mainnet",
      "0x4268": "Holesky",
      "0xaa36a7": "ETH Sepolia",
      "0x5": "ETH Goerli",
      "0x89": "Polygon Mainnet",
      "0x13881": "Polygon Mumbai",
      "0x38": "BSC Mainnet",
      "0x61": "BSC Testnet",
      "0xa4b1": "Arbitrum One",
      "0xa": "Optimism",
      "0xa86a": "Avalanche C-Chain",
      "0xfa": "Fantom Opera",
    }
    setNetwork(networks[chainId] || "Red Desconocida")
  }, [])

  // Actualizar balance - CORREGIDO para ethers v5
  const updateBalance = useCallback(
    async (address, showErrors = false) => {
      if (!provider || isUpdatingBalance || !address) return false

      setIsUpdatingBalance(true)
      try {
        // Pequeño delay para asegurar que el provider esté listo
        await new Promise((resolve) => setTimeout(resolve, 300))

        const balance = await provider.getBalance(address)

        // Usar ethers v5 sintaxis
        const formattedBalance = ethers.utils.formatEther(balance)

        setBalance(formattedBalance)
        console.log("Balance actualizado:", formattedBalance)
        return true
      } catch (error) {
        console.error("Error actualizando balance:", error)

        // Solo mostrar error si se solicita explícitamente y no es un error de red
        if (showErrors && !error.message.includes("network") && !error.message.includes("chain")) {
          showNotification("No se pudo actualizar el saldo", "warning")
        }
        return false
      } finally {
        setIsUpdatingBalance(false)
      }
    },
    [provider, isUpdatingBalance, showNotification],
  )

  // Manejar cambio de red - CORREGIDO para ethers v5
  const handleChainChanged = useCallback(
    async (chainId) => {
      try {
        console.log("Cambio de red detectado:", chainId)

        // Actualizar el nombre de la red inmediatamente
        handleNetworkName(chainId)

        // Crear nuevo provider y signer
        const newProvider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(newProvider)
        const newSigner = newProvider.getSigner()
        setSigner(newSigner)

        // Actualizar balance solo si hay una cuenta conectada
        if (account) {
          // Usar setTimeout para evitar conflictos
          setTimeout(async () => {
            try {
              const balance = await newProvider.getBalance(account)
              // Usar ethers v5 sintaxis
              const formattedBalance = ethers.utils.formatEther(balance)
              setBalance(formattedBalance)
              console.log("Balance actualizado después del cambio de red:", formattedBalance)
            } catch (error) {
              console.error("Error actualizando balance después del cambio de red:", error)
              // No mostrar notificación aquí
            }
          }, 1000)
        }
      } catch (error) {
        console.error("Error en handleChainChanged:", error)
      }
    },
    [account, handleNetworkName],
  )

  // Manejar cambio de cuenta
  const handleAccountsChanged = useCallback(
    (accounts) => {
      if (accounts.length === 0) {
        setAccount("")
        setSigner(null)
        setCurrentPage("home")
      } else {
        setAccount(accounts[0])
        // Actualizar balance con delay, sin mostrar errores
        setTimeout(() => {
          updateBalance(accounts[0], false)
        }, 500)
      }
    },
    [updateBalance],
  )

  // Limpiar event listeners
  useEffect(() => {
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", handleChainChanged)
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [handleChainChanged, handleAccountsChanged])

  // Cargar datos guardados al iniciar
  useEffect(() => {
    if (account) {
      loadTransactionHistory(account)
      loadContacts()
    }
  }, [account])

  // Conectar wallet - CORREGIDO para ethers v5
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        showNotification("Por favor instala MetaMask para usar esta aplicación", "error")
        return false
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider)

      await window.ethereum.request({ method: "eth_requestAccounts" })

      const signer = provider.getSigner()
      setSigner(signer)
      const address = await signer.getAddress()
      setAccount(address)

      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      handleNetworkName(chainId)

      // Actualizar balance con delay
      setTimeout(async () => {
        try {
          const balance = await provider.getBalance(address)
          // Usar ethers v5 sintaxis
          const formattedBalance = ethers.utils.formatEther(balance)
          setBalance(formattedBalance)
        } catch (error) {
          console.error("Error obteniendo balance inicial:", error)
          // No mostrar notificación aquí
        }
      }, 500)

      window.ethereum.on("chainChanged", handleChainChanged)
      window.ethereum.on("accountsChanged", handleAccountsChanged)

      setCurrentPage("dashboard")
      showNotification("Wallet conectada correctamente", "success")
      return true
    } catch (error) {
      showNotification("Error al conectar con MetaMask: " + error.message, "error")
      return false
    }
  }

  // Desconectar wallet
  const disconnectWallet = () => {
    if (window.ethereum) {
      window.ethereum.removeListener("chainChanged", handleChainChanged)
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
    }
    setAccount("")
    setProvider(null)
    setSigner(null)
    setNetwork("")
    setBalance("0")
    setCurrentPage("home")
    showNotification("Sesión cerrada correctamente", "success")
  }

  // Cargar historial de transacciones
  const loadTransactionHistory = async (address) => {
    try {
      const savedTransactions = localStorage.getItem(`transactions_${address}`)
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions))
      }
    } catch (error) {
      console.error("Error cargando historial:", error)
    }
  }

  // Cargar contactos
  const loadContacts = () => {
    try {
      const savedContacts = localStorage.getItem("contacts")
      if (savedContacts) {
        setContacts(JSON.parse(savedContacts))
      }
    } catch (error) {
      console.error("Error cargando contactos:", error)
    }
  }

  // Agregar contacto
  const addContact = (contact) => {
    try {
      const newContacts = [...contacts, contact]
      setContacts(newContacts)
      localStorage.setItem("contacts", JSON.stringify(newContacts))
      showNotification("Contacto agregado exitosamente", "success")
    } catch (error) {
      console.error("Error agregando contacto:", error)
      showNotification("Error al agregar contacto", "error")
    }
  }

  // Eliminar contacto
  const removeContact = (addressToRemove) => {
    try {
      const updatedContacts = contacts.filter((contact) => contact.address !== addressToRemove)
      setContacts(updatedContacts)
      localStorage.setItem("contacts", JSON.stringify(updatedContacts))
      showNotification("Contacto eliminado exitosamente", "success")
    } catch (error) {
      console.error("Error eliminando contacto:", error)
      showNotification("Error al eliminar contacto", "error")
    }
  }

  // Enviar transacción - CORREGIDO para ethers v5
  const sendTransaction = async (transactionData) => {
    try {
      if (!signer) throw new Error("No hay una billetera conectada")

      const { recipient, amount } = transactionData

      // Usar ethers v5 sintaxis
      const amountInWei = ethers.utils.parseEther(amount.toString())

      const tx = await signer.sendTransaction({
        to: recipient,
        value: amountInWei,
      })

      await tx.wait()

      const newTransaction = {
        hash: tx.hash,
        from: account,
        to: recipient,
        amount: amount,
        timestamp: Date.now(),
        network: network,
      }

      const updatedTransactions = [...transactions, newTransaction]
      setTransactions(updatedTransactions)
      localStorage.setItem(`transactions_${account}`, JSON.stringify(updatedTransactions))

      // Actualizar balance después de la transacción
      setTimeout(() => {
        updateBalance(account, false)
      }, 2000)

      showNotification("Transacción completada con éxito", "success")
      return true
    } catch (error) {
      showNotification("Error en la transacción: " + error.message, "error")
      return false
    }
  }

  // Cambiar de red
  const switchNetwork = useCallback(
    async (chainId, networkParams) => {
      try {
        if (!window.ethereum) throw new Error("MetaMask no está instalado")

        console.log("Intentando cambiar a red:", chainId)

        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId }],
          })
        } catch (switchError) {
          // Error 4902 significa que la red no está agregada
          if (switchError.code === 4902 && networkParams) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [networkParams],
              })
              showNotification(`Red ${networkParams.chainName} agregada y cambiada exitosamente`, "success")
            } catch (addError) {
              throw new Error(`Error agregando red: ${addError.message}`)
            }
          } else {
            throw switchError
          }
        }

        return true
      } catch (error) {
        console.error("Error al cambiar de red:", error)
        showNotification("Error cambiando de red: " + error.message, "error")
        return false
      }
    },
    [showNotification],
  )

  // Toggle menú móvil
  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  // Cambiar página
  const handlePageChange = (page) => {
    setCurrentPage(page)
    setMenuOpen(false)
  }

  // Renderizar página actual
  const renderCurrentPage = () => {
    if (!account && currentPage !== "home") {
      return <Home connectWallet={connectWallet} setCurrentPage={handlePageChange} />
    }

    switch (currentPage) {
      case "home":
        return <Home connectWallet={connectWallet} setCurrentPage={handlePageChange} />
      case "dashboard":
        return (
          <Dashboard
            account={account}
            balance={balance}
            network={network}
            updateBalance={updateBalance}
            setCurrentPage={handlePageChange}
          />
        )
      case "transactions":
        return <TransactionForm contacts={contacts} sendTransaction={sendTransaction} />
      case "history":
        return <TransactionHistory currentAddress={account} network={network} />
      case "contacts":
        return <ContactManager contacts={contacts} addContact={addContact} removeContact={removeContact} />
      default:
        return (
          <Dashboard
            account={account}
            balance={balance}
            network={network}
            updateBalance={updateBalance}
            setCurrentPage={handlePageChange}
          />
        )
    }
  }

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
      <main className={`main-content ${!account ? "full-height" : ""}`}>{renderCurrentPage()}</main>
      <Chatbot />
    </div>
  )
}

export default App
