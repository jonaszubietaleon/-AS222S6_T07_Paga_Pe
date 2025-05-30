import React from 'react';
import './components.css';

function Login({ connectWallet }) {
    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo">
                    <img src="/img/icono.png" alt="Logo PagaPe" />
                    <h1>PagaPe</h1>
                </div>
                <p>Tu billetera digital para transacciones en múltiples redes</p>
                <button className="connect-button" onClick={connectWallet}>
                    Conectar con MetaMask
                </button>
            </div>
        </div>
    );
}

export default Login;