import React, { useState } from 'react';
import { 
  UserPlus, 
  Copy, 
  Users, 
  User, 
  Wallet, 
  Search, 
  PlusCircle,
  Import,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './Contact.css';

// Crear una instancia de SweetAlert con soporte para React
const MySwal = withReactContent(Swal);

// La propiedad removeContact ahora es requerida ya que la implementaremos en App.js
function ContactManager({ contacts = [], addContact, removeContact }) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const contactsPerPage = 4; // Modificado para mostrar 4 contactos por página
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!name || !address) {
            MySwal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor complete todos los campos',
                confirmButtonColor: '#3085d6'
            });
            return;
        }
        
        // Validar que la dirección sea un formato Ethereum válido
        if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
            MySwal.fire({
                icon: 'error',
                title: 'Dirección inválida',
                text: 'Por favor ingrese una dirección Ethereum válida',
                confirmButtonColor: '#3085d6'
            });
            return;
        }
        
        // Verificar si el contacto ya existe
        const contactExists = contacts.some(
            contact => contact.address.toLowerCase() === address.toLowerCase()
        );
        
        if (contactExists) {
            MySwal.fire({
                icon: 'warning',
                title: 'Contacto duplicado',
                text: 'Este contacto ya existe en su lista',
                confirmButtonColor: '#3085d6'
            });
            return;
        }
        
        addContact({ name, address });
        
        // Notificar al usuario que el contacto fue añadido exitosamente
        MySwal.fire({
            icon: 'success',
            title: '¡Contacto añadido!',
            text: `${name} ha sido agregado a tus contactos`,
            timer: 1500,
            showConfirmButton: false
        });
        
        // Limpiar el formulario
        setName('');
        setAddress('');
    };
    
    const importContacts = async () => {
        try {
            // Aquí se podría implementar la funcionalidad para importar contactos de MetaMask
            MySwal.fire({
                icon: 'info',
                title: 'Funcionalidad en desarrollo',
                text: 'La importación desde MetaMask estará disponible próximamente',
                confirmButtonColor: '#3085d6'
            });
        } catch (error) {
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al importar contactos: ' + error.message,
                confirmButtonColor: '#3085d6'
            });
        }
    };

    const handleDeleteContact = (contact) => {
        MySwal.fire({
            title: '¿Está seguro?',
            text: `¿Desea eliminar a ${contact.name} de sus contactos?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Check if removeContact is a function before calling it
                if (typeof removeContact === 'function') {
                    removeContact(contact.address);
                    MySwal.fire({
                        title: '¡Eliminado!',
                        text: 'El contacto ha sido eliminado exitosamente.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } else {
                    console.error('removeContact is not defined or not a function');
                    MySwal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo eliminar el contacto. Funcionalidad no implementada.',
                        confirmButtonColor: '#3085d6'
                    });
                }
            }
        });
    };

    // Mostrar alerta de copiado
    const handleCopyAddress = (address) => {
        navigator.clipboard.writeText(address);
        MySwal.fire({
            icon: 'success',
            title: '¡Copiado!',
            text: 'Dirección copiada al portapapeles',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
        });
    };

    // Filtrar contactos según el término de búsqueda
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Lógica de paginación
    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
    const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    
    return (
        <div className="contact-manager">
            <div className="contact-header">
                <h1>Gestionar Contactos</h1>
                <p>Administra tus direcciones Ethereum favoritas</p>
            </div>
            
            <div className="contact-container">
                <div className="contact-sidebar">
                    <div className="add-contact-form">
                        <div className="form-header">
                            <UserPlus size={24} />
                            <h2>Agregar Contacto</h2>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>
                                    <User size={16} />
                                    <span>Nombre</span>
                                </label>
                                <input 
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nombre del contacto"
                                    required
                                    className="contact-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>
                                    <Wallet size={16} />
                                    <span>Dirección Ethereum</span>
                                </label>
                                <input 
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="0x..."
                                    required
                                    className="contact-input"
                                />
                            </div>
                            
                            <button type="submit" className="add-contact-button">
                                <PlusCircle size={18} />
                                Agregar Contacto
                            </button>
                        </form>
                        
                        <button onClick={importContacts} className="import-button">
                            <Import size={18} />
                            Importar de MetaMask
                        </button>
                    </div>
                </div>
                
                <div className="contact-list-container">
                    <div className="list-header">
                        <div className="list-title">
                            <Users size={24} />
                            <h2>Mis Contactos</h2>
                        </div>
                        
                        <div className="search-container">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Buscar contactos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>
                    
                    {filteredContacts.length === 0 ? (
                        <div className="no-contacts">
                            <User size={48} />
                            <p>{searchTerm ? "No se encontraron contactos" : "No hay contactos para mostrar"}</p>
                            <p className="no-contacts-subtext">
                                {searchTerm ? "Intenta con otro término de búsqueda" : "Agrega tu primer contacto para comenzar"}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="contact-list">
                                {currentContacts.map((contact, index) => (
                                    <div key={index} className="contact-item">
                                        <div className="contact-avatar">
                                            <User size={24} />
                                        </div>
                                        <div className="contact-info">
                                            <div className="contact-name">{contact.name}</div>
                                            <div className="contact-address">
                                                {contact.address.slice(0, 6)}...{contact.address.slice(-4)}
                                            </div>
                                        </div>
                                        <div className="contact-actions">
                                            <button 
                                                className="copy-address-button"
                                                onClick={() => handleCopyAddress(contact.address)}
                                                title="Copiar dirección"
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <button 
                                                className="delete-contact-button"
                                                onClick={() => handleDeleteContact(contact)}
                                                title="Eliminar contacto"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Paginación - mostrar solo si hay más de 4 contactos */}
                            {filteredContacts.length > contactsPerPage && (
                                <div className="pagination">
                                    <button 
                                        className="pagination-button"
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <div className="pagination-info">
                                        Página {currentPage} de {totalPages}
                                    </div>
                                    <button 
                                        className="pagination-button"
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ContactManager;