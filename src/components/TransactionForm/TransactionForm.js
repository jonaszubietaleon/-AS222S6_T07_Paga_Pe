import { useState } from 'react';
import './TransactionForm.css';
import { Send, Users, Code, Wallet, ChevronDown, Plus, X } from 'lucide-react';

function TransactionForm({ contacts, sendTransaction }) {
    const [isDual, setIsDual] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [secondRecipient, setSecondRecipient] = useState('');
    const [secondAmount, setSecondAmount] = useState('');
    const [selectedContact, setSelectedContact] = useState('');
    const [secondSelectedContact, setSecondSelectedContact] = useState('');
    
    const [isSmartContract, setIsSmartContract] = useState(false);
    const [contractAddress, setContractAddress] = useState('');
    const [functionName, setFunctionName] = useState('');
    const [contractParams, setContractParams] = useState([{ name: '', value: '', type: 'string' }]);
    const [gasLimit, setGasLimit] = useState('21000');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isSmartContract) {
            if (!contractAddress || !functionName) {
                alert('Por favor complete la dirección del contrato y el nombre de la función');
                return;
            }
        } else {
            if (!recipient || !amount || (isDual && (!secondRecipient || !secondAmount))) {
                alert('Por favor complete todos los campos');
                return;
            }
            
            if (isNaN(parseFloat(amount)) || (isDual && isNaN(parseFloat(secondAmount)))) {
                alert('Por favor ingrese montos válidos');
                return;
            }
        }
        
        const transactionData = {
            recipient,
            amount: parseFloat(amount) || 0,
            isDual,
            secondRecipient: isDual ? secondRecipient : '',
            secondAmount: isDual ? parseFloat(secondAmount) : 0,
            isSmartContract,
            contractAddress: isSmartContract ? contractAddress : '',
            functionName: isSmartContract ? functionName : '',
            contractParams: isSmartContract ? contractParams : [],
            gasLimit: parseInt(gasLimit)
        };
        
        await sendTransaction(transactionData);
        
        setRecipient('');
        setAmount('');
        setSecondRecipient('');
        setSecondAmount('');
        setSelectedContact('');
        setSecondSelectedContact('');
        setContractAddress('');
        setFunctionName('');
        setContractParams([{ name: '', value: '', type: 'string' }]);
        setGasLimit('21000');
    };
    
    const handleContactSelect = (e) => {
        const selectedAddress = e.target.value;
        setSelectedContact(selectedAddress);
        if (selectedAddress) {
            setRecipient(selectedAddress);
        }
    };
    
    const handleSecondContactSelect = (e) => {
        const selectedAddress = e.target.value;
        setSecondSelectedContact(selectedAddress);
        if (selectedAddress) {
            setSecondRecipient(selectedAddress);
        }
    };
    
    const addContractParam = () => {
        setContractParams([...contractParams, { name: '', value: '', type: 'string' }]);
    };
    
    const removeContractParam = (index) => {
        if (contractParams.length > 1) {
            setContractParams(contractParams.filter((_, i) => i !== index));
        }
    };
    
    const updateContractParam = (index, field, value) => {
        const updated = contractParams.map((param, i) => 
            i === index ? { ...param, [field]: value } : param
        );
        setContractParams(updated);
    };
    
    const handleTransactionTypeChange = (type) => {
        if (type === 'simple') {
            setIsDual(false);
            setIsSmartContract(false);
        } else if (type === 'dual') {
            setIsDual(true);
            setIsSmartContract(false);
        } else if (type === 'smart-contract') {
            setIsDual(false);
            setIsSmartContract(true);
        }
    };
    
    return (
        <div className="transaction-form-container">
            <div className="form-card">
                {/* Header */}
                <div className="form-header">
                    <h2 className="flex items-center gap-3">
                        <Send className="w-7 h-7" />
                        Enviar Transacción
                    </h2>
                    <p>Elige el tipo de transacción que deseas realizar</p>
                </div>
                
                {/* Transaction Type Selector */}
                <div className="transaction-type-selector">
                    <div className="type-buttons-grid">
                        <button 
                            className={`type-button ${!isDual && !isSmartContract ? 'active' : ''}`}
                            onClick={() => handleTransactionTypeChange('simple')}
                        >
                            <Wallet className="icon" />
                            <div className="title">Transacción Simple</div>
                            <div className="description">Un destinatario</div>
                        </button>
                        
                        <button 
                            className={`type-button ${isDual && !isSmartContract ? 'active' : ''}`}
                            onClick={() => handleTransactionTypeChange('dual')}
                        >
                            <Users className="icon" />
                            <div className="title">Transacción Dual</div>
                            <div className="description">Dos destinatarios</div>
                        </button>
                        
                        <button 
                            className={`type-button ${isSmartContract ? 'active' : ''}`}
                            onClick={() => handleTransactionTypeChange('smart-contract')}
                        >
                            <Code className="icon" />
                            <div className="title">Smart Contract</div>
                            <div className="description">Interactuar con contrato</div>
                        </button>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="form-content">
                    {/* Normal Transactions */}
                    {!isSmartContract && (
                        <div className="space-y-6">
                            {/* Primary Recipient */}
                            <div className="form-section primary-section">
                                <h3 className="section-title">Destinatario Principal</h3>
                                
                                <div className="space-y-4">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Seleccionar Contacto (opcional)
                                        </label>
                                        <div className="select-wrapper">
                                            <select 
                                                value={selectedContact} 
                                                onChange={handleContactSelect}
                                                className="form-input"
                                            >
                                                <option value="">Seleccione un contacto o ingrese dirección</option>
                                                {contacts && contacts.map((contact, index) => (
                                                    <option key={index} value={contact.address}>
                                                        {contact.name} ({contact.address.slice(0, 6)}...{contact.address.slice(-4)})
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="select-arrow" />
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label className="form-label">
                                            Dirección de Destinatario
                                        </label>
                                        <input 
                                            type="text"
                                            value={recipient}
                                            onChange={(e) => setRecipient(e.target.value)}
                                            placeholder="0x..."
                                            required
                                            className="form-input font-mono"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label className="form-label">
                                            Monto a Enviar (ETH)
                                        </label>
                                        <input 
                                            type="text"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.01"
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Secondary Recipient */}
                            {isDual && (
                                <div className="form-section secondary-section">
                                    <h3 className="section-title">Segundo Destinatario</h3>
                                    
                                    <div className="space-y-4">
                                        <div className="form-group">
                                            <label className="form-label">
                                                Seleccionar Segundo Contacto (opcional)
                                            </label>
                                            <div className="select-wrapper">
                                                <select 
                                                    value={secondSelectedContact} 
                                                    onChange={handleSecondContactSelect}
                                                    className="form-input"
                                                >
                                                    <option value="">Seleccione un contacto o ingrese dirección</option>
                                                    {contacts && contacts.map((contact, index) => (
                                                        <option key={index} value={contact.address}>
                                                            {contact.name} ({contact.address.slice(0, 6)}...{contact.address.slice(-4)})
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="select-arrow" />
                                            </div>
                                        </div>
                                        
                                        <div className="form-group">
                                            <label className="form-label">
                                                Dirección de Segundo Destinatario
                                            </label>
                                            <input 
                                                type="text"
                                                value={secondRecipient}
                                                onChange={(e) => setSecondRecipient(e.target.value)}
                                                placeholder="0x..."
                                                required
                                                className="form-input font-mono"
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label className="form-label">
                                                Monto a Enviar al Segundo Destinatario (ETH)
                                            </label>
                                            <input 
                                                type="text"
                                                value={secondAmount}
                                                onChange={(e) => setSecondAmount(e.target.value)}
                                                placeholder="0.01"
                                                required
                                                className="form-input"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Smart Contract Section */}
                    {isSmartContract && (
                        <div className="space-y-6">
                            <div className="form-section secondary-section">
                                <h3 className="section-title">Configuración del Smart Contract</h3>
                                
                                <div className="space-y-4">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Dirección del Contrato
                                        </label>
                                        <input 
                                            type="text"
                                            value={contractAddress}
                                            onChange={(e) => setContractAddress(e.target.value)}
                                            placeholder="0x..."
                                            required
                                            className="form-input font-mono"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label className="form-label">
                                            Nombre de la Función
                                        </label>
                                        <input 
                                            type="text"
                                            value={functionName}
                                            onChange={(e) => setFunctionName(e.target.value)}
                                            placeholder="transfer, approve, mint..."
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label className="form-label">
                                            Valor ETH (opcional)
                                        </label>
                                        <input 
                                            type="text"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.0"
                                            className="form-input"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label className="form-label">
                                            Gas Limit
                                        </label>
                                        <input 
                                            type="text"
                                            value={gasLimit}
                                            onChange={(e) => setGasLimit(e.target.value)}
                                            placeholder="21000"
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Contract Parameters */}
                            <div className="form-section">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="section-title">Parámetros de la Función</h3>
                                    <button 
                                        type="button"
                                        onClick={addContractParam}
                                        className="add-param-btn"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Agregar
                                    </button>
                                </div>
                                
                                <div className="space-y-3">
                                    {contractParams.map((param, index) => (
                                        <div key={index} className="param-row">
                                            <div className="param-input">
                                                <label className="form-label">Nombre</label>
                                                <input 
                                                    type="text"
                                                    value={param.name}
                                                    onChange={(e) => updateContractParam(index, 'name', e.target.value)}
                                                    placeholder="nombreParametro"
                                                    className="form-input text-sm"
                                                />
                                            </div>
                                            <div className="param-input">
                                                <label className="form-label">Valor</label>
                                                <input 
                                                    type="text"
                                                    value={param.value}
                                                    onChange={(e) => updateContractParam(index, 'value', e.target.value)}
                                                    placeholder="valor"
                                                    className="form-input text-sm"
                                                />
                                            </div>
                                            <div className="param-type">
                                                <label className="form-label">Tipo</label>
                                                <select 
                                                    value={param.type}
                                                    onChange={(e) => updateContractParam(index, 'type', e.target.value)}
                                                    className="form-input text-sm"
                                                >
                                                    <option value="string">string</option>
                                                    <option value="uint256">uint256</option>
                                                    <option value="address">address</option>
                                                    <option value="bool">bool</option>
                                                    <option value="bytes">bytes</option>
                                                </select>
                                            </div>
                                            {contractParams.length > 1 && (
                                                <button 
                                                    type="button"
                                                    onClick={() => removeContractParam(index)}
                                                    className="remove-param-btn"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="submit-btn"
                    >
                        <Send className="w-5 h-5" />
                        Enviar Transacción
                    </button>
                </form>
            </div>
        </div>
    );
}

export default TransactionForm;