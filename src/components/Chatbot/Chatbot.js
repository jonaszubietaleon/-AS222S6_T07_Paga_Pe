// src/components/Chatbot/Chatbot.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';
import { chatbotConfig } from './chatbotConfig';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { 
      text: chatbotConfig.welcomeMessage, 
      sender: 'bot',
      suggestions: chatbotConfig.welcomeSuggestions || [] 
    }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [closing, setClosing] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState(chatbotConfig.welcomeSuggestions || chatbotConfig.generalSuggestions || []);
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target) && 
          !event.target.closest('.chatbot-toggle')) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Update currentSuggestions when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'bot') {
        // Si el mensaje tiene sugerencias específicas, usarlas
        if (lastMessage.suggestions && lastMessage.suggestions.length > 0) {
          setCurrentSuggestions(lastMessage.suggestions);
        } else {
          // Si no tiene sugerencias específicas, usar las generales
          setCurrentSuggestions(chatbotConfig.generalSuggestions || []);
        }
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpen = () => {
    setIsOpen(true);
    setClosing(false);
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setClosing(false);
    }, 300); // Match animation duration
  };

  const handleSuggestionClick = (suggestion) => {
    // Añadir el texto de la sugerencia como mensaje del usuario
    const userMessage = { text: suggestion, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    
    // Procesar la respuesta como si el usuario hubiera escrito el texto
    processUserInput(suggestion);
  };

  const handleSend = async () => {
    const userInput = input.trim();
    if (!userInput || isLoading) return;
    
    // Add user message
    const userMessage = { text: userInput, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Procesar el input del usuario
    processUserInput(userInput);
  };

  const processUserInput = async (userInput) => {
    setIsLoading(true);
    
    // Añadir un mensaje temporal de carga
    setMessages(prev => [...prev, { 
      text: "", 
      sender: 'bot',
      loading: true
    }]);

    try {
      // Check for FAQ matches first
      const faqResponse = checkFaq(userInput);
      if (faqResponse) {
        setTimeout(() => {
          // Determinar si este tipo de respuesta debería tener sugerencias
          const suggestions = getSuggestionsForResponse(userInput);
          
          // Reemplazar el mensaje de carga con la respuesta real
          setMessages(prev => {
            const newMessages = [...prev];
            // Reemplazar el último mensaje (loading) con la respuesta real
            newMessages[newMessages.length - 1] = { 
              text: faqResponse, 
              sender: 'bot',
              suggestions: suggestions 
            };
            return newMessages;
          });
          
          setIsLoading(false);
        }, 700); // Small delay for natural feel
        return;
      }

      // If no FAQ match, call the API
      const response = await callChatbotAPI(userInput);
      // Determine appropriate suggestions for API response
      const suggestions = getSuggestionsForResponse(userInput);
      
      // Reemplazar el mensaje de carga con la respuesta real
      setMessages(prev => {
        const newMessages = [...prev];
        // Reemplazar el último mensaje (loading) con la respuesta real
        newMessages[newMessages.length - 1] = { 
          text: response, 
          sender: 'bot',
          suggestions: suggestions 
        };
        return newMessages;
      });
    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Reemplazar el mensaje de carga con el mensaje de error
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          text: chatbotConfig.defaultResponses.error, 
          sender: 'bot',
          suggestions: chatbotConfig.errorSuggestions || [] 
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para determinar sugerencias basadas en la respuesta
  const getSuggestionsForResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    // Verificar categorías específicas y devolver sugerencias relevantes
    if (lowerInput.includes('seguridad')) {
      return chatbotConfig.securitySuggestions || [];
    } else if (lowerInput.includes('transacción') || lowerInput.includes('transacciones') || lowerInput.includes('enviar')) {
      return chatbotConfig.transactionSuggestions || [];
    } else if (lowerInput.includes('wallet') || lowerInput.includes('billetera')) {
      return chatbotConfig.walletSuggestions || [];
    } else if (lowerInput.includes('problema')) {
      return chatbotConfig.troubleshootingSuggestions || [];
    }
    
    // Para fallback o respuestas genéricas
    return chatbotConfig.generalSuggestions || [];
  };

  const checkFaq = (input) => {
    const lowerInput = input.toLowerCase();
    for (const [keyword, response] of Object.entries(chatbotConfig.faq)) {
      if (lowerInput.includes(keyword)) {
        return response;
      }
    }
    return null;
  };

  const callChatbotAPI = async (userInput) => {
    // If you're using a local API or different service, adjust this
    if (process.env.REACT_APP_USE_LOCAL_CHATBOT === 'true') {
      return simulateLocalResponse(userInput);
    }

    // Using OpenAI API (or similar)
    try {
      const response = await axios.post(
        chatbotConfig.apiEndpoint,
        {
          model: "gpt-3.5-turbo",
          messages: [
            { 
              role: "system", 
              content: "Eres un asistente útil de Paga'pe, una app de pagos blockchain. " +
                      "Responde de forma concisa y profesional en español. " +
                      "Si no sabes la respuesta, di que no puedes ayudar con eso."
            },
            ...messages.filter(m => m.sender === 'user').map(m => ({ 
              role: "user", 
              content: m.text 
            })),
            { role: "user", content: userInput }
          ],
          max_tokens: 150,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('API Error:', error);
      return chatbotConfig.defaultResponses.error;
    }
  };

  const simulateLocalResponse = (input) => {
    // Simple local responses for testing without API
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('hola')) {
      return chatbotConfig.defaultResponses.greeting;
    }
    if (lowerInput.includes('gracias') || lowerInput.includes('adiós')) {
      return chatbotConfig.defaultResponses.goodbye;
    }
    if (lowerInput.includes('ayuda')) {
      return chatbotConfig.defaultResponses.help;
    }
    return chatbotConfig.defaultResponses.fallback;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''} ${closing ? 'closing' : ''}`}>
      <button 
        className="chatbot-toggle"
        onClick={isOpen ? handleClose : handleOpen}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? 
          '×' : 
          <img src="/img/icono.png" alt="Chat" />
        }
      </button>
      
      {(isOpen || closing) && (
        <div 
          className="chatbot-window"
          ref={chatWindowRef}
        >
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <img src="/img/icono.png" alt="Logo" className="chatbot-header-icon" />
              <div>
                <h3>Asistente Paga'pe</h3>
                <div className="status">En línea</div>
              </div>
            </div>
            <button 
              onClick={handleClose}
              aria-label="Cerrar chat"
            >
              ×
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={`message-${i}`} className="message-container">
                <div className={`message ${msg.sender} ${msg.loading ? 'loading' : ''}`}>
                  {!msg.loading && msg.text}
                  {msg.loading && <span></span>}
                </div>
              </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chatbot-input-container">
            {/* Área de sugerencias sobre el input */}
            {currentSuggestions && currentSuggestions.length > 0 && (
              <div className="chatbot-suggestions" ref={suggestionsRef}>
                {currentSuggestions.map((suggestion, index) => (
                  <button
                    key={`suggestion-${index}`}
                    className="suggestion-button"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            
            <div className="chatbot-input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta..."
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                aria-label="Escribe tu mensaje"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                aria-label="Enviar mensaje"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;