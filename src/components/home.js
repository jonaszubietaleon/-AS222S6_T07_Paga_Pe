import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from "tsparticles";
import './Home.css'; 


// Registramos los plugins de GSAP
gsap.registerPlugin(ScrollTrigger);

// Componente de Tarjeta Animada Mejorado
const AnimatedCard = ({ children, delay = 0, animation = "fadeIn", duration = 0.8 }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    
    const timer = setTimeout(() => {
      gsap.fromTo(card, 
        { 
          opacity: 0,
          y: animation === "slideUp" ? 40 : 0,
          scale: animation === "zoomIn" ? 0.95 : 1
        }, 
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: duration,
          ease: "power3.out"
        }
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, animation, duration]);

  return (
    <div ref={cardRef} className="animated-card" style={{ opacity: 0 }}>
      {children}
    </div>
  );   
};const Counter = ({ target, duration = 2000, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const currentRef = counterRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const increment = target / (duration / 16);
          
          timerRef.current = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timerRef.current);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(currentRef);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [target, duration]);

  return (
    <span ref={counterRef} className="counter">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const Home = ({ connectWallet, setCurrentPage }) => {
  const [activeFeature, setActiveFeature] = useState(0);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const teamRef = useRef(null);

  const particlesInit = async (engine) => {
    // Esta línea es importante: loadFull necesita un "engine" válido.
    await loadFull(engine);
  };

  const particlesOptions = {
    fullScreen: { enable: false, zIndex: 1 },
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: "#f2c94c" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#f2c94c",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: { enable: true, rotateX: 600, rotateY: 1200 }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
        resize: true
      },
      modes: {
        grab: { distance: 140, line_linked: { opacity: 1 } },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  };

  // Datos del equipo mejorados
  const teamMembers = [
    {
      name: "Cristhoper Socalay",
      role: "Blockchain Architect",
      photo: "https://media.licdn.com/dms/image/v2/D4E03AQHXfAeH7GpF_A/profile-displayphoto-shrink_800_800/0/1665289684593?e=1752710400&v=beta&t=W4-2lT35pNSkhWRQIb-Dfgvfylm7Q_3W9grgmoqnlcs",
      bio: "Experto en Solidity y arquitecturas DeFi con 5 años de experiencia en proyectos blockchain escalables.",
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#"
      },
      skills: ["Solidity", "Rust", "Layer 2", "ZK Proofs"]
    },
    {
      name: "Jonas Zubieta",
      role: "Lead UX/UI Designer",
      photo: "https://media.licdn.com/dms/image/v2/D4E03AQEXz-ZJ-ARMPA/profile-displayphoto-shrink_400_400/B4EZYeXOn6HkAg-/0/1744266128463?e=1752710400&v=beta&t=E3-oUFSuXjOFDD3umWeQpmMXzX6eW8QN-0GeIVZlvDA",
      bio: "Especialista en diseño de interfaces financieras y experiencia de usuario para aplicaciones Web3.",
      social: {
        linkedin: "#",
        dribbble: "#",
        behance: "#"
      },
      skills: ["Figma", "UX Research", "Prototyping", "Motion Design"]
    },
  ];

  // Características mejoradas con animación
  const features = [
    {
      title: "Balance en Tiempo Real",
      description: "Monitoreo instantáneo de fondos con actualizaciones en tiempo real directamente desde la blockchain",
      icon: '📈',
      animation: "fadeIn",
      gradient: "linear-gradient(135deg, #001f3f 0%, #2f80ed 100%)"
    },
    {
      title: "Transacciones Instantáneas",
      description: "Confirmación en segundos con nuestra tecnología Layer 2 patentada y bajas comisiones",
      icon: '⚡',
      animation: "slideUp",
      gradient: "linear-gradient(135deg, #001f3f 0%, #2f80ed 100%)"
    },
    {
      title: "Seguridad Institucional",
      description: "Protección multi-firma, verificación en cadena y almacenamiento en frío opcional",
      icon: '🔒',
      animation: "zoomIn",
      gradient: "linear-gradient(135deg, #001f3f 0%, #2f80ed 100%)"
    },
    {
      title: "Gestión Inteligente",
      description: "Organiza contactos, transacciones frecuentes y crea flujos de pagos automatizados",
      icon: '💼',
      animation: "fadeIn",
      gradient: "linear-gradient(135deg, #001f3f 0%, #2f80ed 100%)"
    },
    {
      title: "Staking Integrado",
      description: "Genera rendimientos directamente desde tu wallet sin intermediarios",
      icon: '💰',
      animation: "slideUp",
      gradient: "linear-gradient(135deg, #001f3f 0%, #2f80ed 100%)"
    },
    {
      title: "NFT Compatible",
      description: "Visualiza y gestiona tu colección de NFTs junto con tus activos digitales",
      icon: '🖼️',
      animation: "zoomIn",
      gradient: "linear-gradient(135deg, #001f3f 0%, #2f80ed 100%)"
    }
  ];

  // Wallets soportadas
  const supportedWallets = [
    { name: "MetaMask", icon: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg", link: "#" },
    { name: "Coinbase", icon: "https://cdn-icons-png.flaticon.com/512/2503/2503795.png", link: "#" },
    { name: "Trust Wallet", icon: "https://trustwallet.com/assets/images/media/assets/TWT.png", link: "#" },
    { name: "Ledger", icon: "https://cdn-icons-png.flaticon.com/512/2503/2503898.png", link: "#" },
    { name: "Trezor", icon: "https://cdn-icons-png.flaticon.com/512/2503/2503922.png", link: "#" }
  ];

  // Estadísticas mejoradas
  const stats = [
    { value: <Counter target={125} suffix="+" />, label: "Países soportados", icon: "🌍" },
    { value: <Counter target={24} suffix="+" />, label: "Blockchains integradas", icon: "⛓️" },
    { value: <Counter target={100} prefix="+" suffix="K" />, label: "Usuarios activos", icon: "👥" },
    { value: <Counter target={150} suffix="+" />, label: "Tokens disponibles", icon: "💱" }
  ];

  // Testimonios mejorados
  const testimonials = [
    {
      quote: "Paga'pe ha revolucionado cómo manejo mis finanzas internacionales. Las transacciones son instantáneas y las comisiones mínimas.",
      author: "Angel Castilla",
      role: "Analista en Sistema",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjURtR6EQIi4l-jf4gI8-YzaGu873MojCoKdjczaxS9-9V02V7f3=s48-p",
      rating: 5
    },
    {
      quote: "Como freelancer que trabaja con clientes en todo el mundo, Paga'pe me ha ahorrado horas de gestión y cientos en comisiones bancarias.",
      author: "Alexa Rejas",
      role: "Analista en Sistema",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjUob6IRYy8NNdmEm3yzfm16fyWN5QreGWcTOLv15E5vRyVuA9E=s48-p",
      rating: 5
    },
    {
      quote: "La seguridad y facilidad de uso de Paga'pe no tienen comparación. Mi empresa ha migrado todas nuestras operaciones internacionales a esta plataforma.",
      author: "Danna Lopez",
      role: "Analista en Sistemas",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWg-FmsRJa-wx3kz7G6nkQi_V1_8imXvR9UmGb7PdQq8VwTMC_4=s48-p",
      rating: 4
    }
  ];

  // Sección de Introducción 
  const introductionPoints = [
    {
      icon: '📝',
      title: 'Descripción',
      content: 'Paga\'pe es una plataforma revolucionaria de pagos transfronterizos basada en tecnología blockchain que permite transacciones instantáneas, seguras y con costos mínimos entre cualquier parte del mundo.',
      animation: "fadeIn"
    },
    {
      icon: '🎯',
      title: 'Objetivos',
      content: 'Nuestro objetivo es democratizar el acceso a servicios financieros globales, eliminando barreras geográficas y reduciendo los costos tradicionales asociados a transacciones internacionales.',
      animation: "slideUp"
    },
    {
      icon: '💰',
      title: 'Beneficios',
      content: 'Los usuarios disfrutan de comisiones hasta un 90% más bajas que los servicios tradicionales, velocidad de transacción en segundos y acceso a un ecosistema financiero global sin intermediarios.',
      animation: "zoomIn"
    },
    {
      icon: '⚙️',
      title: 'Características',
      content: 'Incluye billetera multicadena, conversión automática de divisas, staking integrado, gestión de NFTs y un sistema de seguridad institucional con protección multi-firma.',
      animation: "fadeIn"
    }
  ];

  // Efectos GSAP para animaciones avanzadas
  useEffect(() => {
    // Animación para las características
    gsap.fromTo(featuresRef.current.querySelectorAll('.feature-tab'), 
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%"
        }
      }
    );

    // Animación para las estadísticas
    gsap.fromTo(statsRef.current.querySelectorAll('.stat-card'), 
      { opacity: 0, scale: 0.9 },
      { 
        opacity: 1, 
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%"
        }
      }
    );

    // Animación para el equipo
    gsap.fromTo(teamRef.current.querySelectorAll('.team-card'), 
      { opacity: 0, y: 40 },
      { 
        opacity: 1, 
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: teamRef.current,
          start: "top 80%"
        }
      }
    );
  }, []);

  // Rotación automática de características mejorada
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
      
      // Animación GSAP para el cambio de características
      gsap.fromTo('.features-content', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 }
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="home-page">
      {/* Hero Section Ultra Premium */}
      <section className="hero-section">
        <div className="hero-bg-overlay"></div>
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesOptions}
          className="particles-container"
        />
        
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <AnimatedCard delay={200} animation="slideUp">
                <h1>
                  <span className="highlight">Paga'pe</span>
                  <span className="sub-headline">El Futuro de las Finanzas Globales</span>
                </h1>
              </AnimatedCard>

              <AnimatedCard delay={400} animation="slideUp">
                <p className="subtitle">
                  La plataforma Web3 más avanzada para pagos transfronterizos, diseñada para la economía digital del mañana
                </p>
              </AnimatedCard>

              <AnimatedCard delay={600} animation="slideUp">
                <div className="hero-buttons">
                  <button className="connect-button glow-on-hover" onClick={connectWallet}>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                      alt="MetaMask"
                      className="wallet-logo"
                    />
                    Conectar Wallet
                  </button>
               
                </div>
              </AnimatedCard>

              <AnimatedCard delay={800} animation="fadeIn">
                <div className="security-badges">
                  <div className="audit-badge">
                    <span>🔐 Auditoría Certificada por Quantstamp</span>
                  </div>
                  <div className="audit-badge">
                    <span>🛡️ Protección de Seguro de hasta $1M</span>
                  </div>
                </div>
              </AnimatedCard>
            </div>

            <div className="hero-image">
              <AnimatedCard delay={1000} animation="zoomIn" duration={1.2}>
                <div className="phone-mockup floating">
                  <div className="screen">
                    <div className="app-interface">
                      <div className="network-indicator">
                        <span className="dot"></span>
                        <span className="network-name">Paga'pe</span>
                        <span className="network-status">• Conectado</span>
                      </div>
                      <div className="balance-display">
                        <span className="currency">$</span>
                        <span className="amount">1,245.50</span>
                        <span className="currency">USD</span>
                      </div>
                      <div className="action-buttons">
                        <button className="send-btn">Enviar</button>
                        <button className="receive-btn">Recibir</button>
                        <button className="swap-btn">Swap</button>
                      </div>
                      <div className="recent-transactions">
                        <div className="transaction">
                          <div className="tx-icon received">📥</div>
                          <div className="tx-details">
                            <span className="tx-title">Depósito inicial</span>
                            <span className="tx-date">Hace 2 horas</span>
                          </div>
                          <div className="tx-amount positive">+ $1,200.00</div>
                        </div>
                        <div className="transaction">
                          <div className="tx-icon sent">📤</div>
                          <div className="tx-details">
                            <span className="tx-title">Envío a Juan Condori</span>
                            <span className="tx-date">Hace 4 horas</span>
                          </div>
                          <div className="tx-amount negative">- $50.00</div>
                        </div>
                        <div className="transaction">
                          <div className="tx-icon swap">🔄</div>
                          <div className="tx-details">
                            <span className="tx-title">ETH → USDC</span>
                            <span className="tx-date">Ayer</span>
                          </div>
                          <div className="tx-amount neutral">$1,150.00</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="phone-reflection"></div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </section>

      {/* Introducción al Proyecto - Ultra Premium */}
      <section className="introduction-section">
        <div className="container">
          <div className="section-header">
            <AnimatedCard animation="fadeIn">
              <h2>Introducción al <span className="highlight">Proyecto</span></h2>
            </AnimatedCard>
            <AnimatedCard animation="fadeIn" delay={200}>
              <p>La nueva generación de pagos globales construida sobre tecnología blockchain</p>
            </AnimatedCard>
          </div>

          <div className="introduction-grid">
            {introductionPoints.map((point, index) => (
              <AnimatedCard key={index} delay={index * 200} animation={point.animation}>
                <div className="introduction-card">
                  <div className="card-icon">{point.icon}</div>
                  <h3>{point.title}</h3>
                  <p>{point.content}</p>
                  <div className="card-decoration">
                    <div className="decoration-line"></div>
                    <div className="decoration-dot"></div>
                  </div>
                  <div className="card-background"></div>
                </div>
              </AnimatedCard>
            ))}
          </div>

          <AnimatedCard animation="fadeIn" delay={800}>
            <div className="technology-stack">
              <h4>Tecnologías Utilizadas</h4>
              <div className="stack-items">
                <span className="stack-item">
                  <img src="https://cdn.worldvectorlogo.com/logos/solidity.svg" alt="Solidity" />
                  Solidity
                </span>
                <span className="stack-item">
                  <img src="https://cdn.worldvectorlogo.com/logos/react-2.svg" alt="React" />
                  React
                </span>
                <span className="stack-item">
                  <img src="https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg" alt="Node.js" />
                  Node.js
                </span>
                <span className="stack-item">
                  <img src="https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg" alt="Layer 2" />
                  Layer 2
                </span>
               
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Features Section Ultra Premium */}
      <section className="features-section" ref={featuresRef}>
        <div className="container">
          <div className="section-header">
            <h2>Potencia tus <span className="highlight">Finanzas Digitales</span></h2>
            <p>Una suite completa de herramientas financieras descentralizadas en una sola plataforma</p>
          </div>

          <div className="features-tabs">
            <div className="features-nav">
              {features.map((feature, index) => (
                <button
                  key={index}
                  className={`feature-tab ${index === activeFeature ? 'active' : ''}`}
                  onClick={() => setActiveFeature(index)}
                  style={{ 
                    background: index === activeFeature ? feature.gradient : 'transparent',
                    borderColor: index === activeFeature ? 'transparent' : 'rgba(0,31,63,0.1)'
                  }}
                >
                  <span className="tab-icon">{feature.icon}</span>
                  {feature.title}
                </button>
              ))}
            </div>
            <div className="features-content">
              <AnimatedCard key={activeFeature} animation="fadeIn" duration={0.6}>
                <div className="feature-detail" style={{ background: features[activeFeature].gradient }}>
                  <h3>{features[activeFeature].title}</h3>
                  <p>{features[activeFeature].description}</p>
                  <div className="feature-actions">
                    <button className="learn-more-btn">Más información</button>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section Mejorada */}
      <section className="stats-section" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div className="stat-card" key={index}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-decoration"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blockchain Network Visualization Mejorado */}
      <section className="network-section">
        <div className="container">
          <div className="section-header">
            <h2>Tecnología <span className="highlight">Multicadena</span></h2>
            <p>Conectando las blockchains más importantes en una sola interfaz</p>
          </div>
          <div className="network-visualization">
            <div className="network-node main-node">
              <div className="node-icon">
                <img src="/img/icono.png" alt="Paga'pe Logo" className="network-logo" />
              </div>
            </div>
            <div className="network-connections">
              <div className="connection-line eth">
                <div className="connection-dots"></div>
                <div className="chain-logo">⟠</div>
              </div>
              <div className="connection-line bsc">
                <div className="connection-dots"></div>
                <div className="chain-logo">⎈</div>
              </div>
              <div className="connection-line polygon">
                <div className="connection-dots"></div>
                <div className="chain-logo">⬡</div>
              </div>
              <div className="connection-line solana">
                <div className="connection-dots"></div>
                <div className="chain-logo">◎</div>
              </div>
            </div>
            <div className="network-nodes">
              <div className="network-node eth">
                <div className="node-icon">⟠</div>
                <div className="node-label">Ethereum</div>
              </div>
              <div className="network-node bsc">
                <div className="node-icon">⎈</div>
                <div className="node-label">BNB Chain</div>
              </div>
              <div className="network-node polygon">
                <div className="node-icon">⬡</div>
                <div className="node-label">Polygon</div>
              </div>
              <div className="network-node solana">
                <div className="node-icon">◎</div>
                <div className="node-label">Solana</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section Ultra Premium */}
      <section className="team-section" ref={teamRef}>
        <div className="container">
          <div className="section-header">
            <h2>Nuestro <span className="highlight">Equipo</span></h2>
            <p>Los expertos en blockchain y finanzas detrás de Paga'pe</p>
          </div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div className="team-card" key={index}>
                <div className="team-photo-container">
                  <div
                    className="team-photo"
                    style={{ backgroundImage: `url(${member.photo})` }}
                  />
                  <div className="team-social-hover">
                    {Object.entries(member.social).map(([platform, url]) => (
                      <a key={platform} href={url} className={`social-${platform}`} target="_blank" rel="noopener noreferrer">
                        {platform === 'github' && <i className="fab fa-github"></i>}
                        {platform === 'linkedin' && <i className="fab fa-linkedin-in"></i>}
                        {platform === 'twitter' && <i className="fab fa-twitter"></i>}
                        {platform === 'dribbble' && <i className="fab fa-dribbble"></i>}
                        {platform === 'behance' && <i className="fab fa-behance"></i>}
                      </a>
                    ))}
                  </div>
                </div>
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
                <p className="bio">{member.bio}</p>
                <div className="skills-container">
                  {member.skills.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
                <div className="team-card-decoration"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section Mejorada */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Lo que dicen <span className="highlight">nuestros usuarios</span></h2>
            <p>Testimonios de la comunidad Paga'pe</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <AnimatedCard key={index} delay={index * 200} animation="slideUp">
                <div className="testimonial-card">
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < testimonial.rating ? 'star filled' : 'star'}>★</span>
                    ))}
                  </div>
                  <div className="testimonial-quote">"{testimonial.quote}"</div>
                  <div className="testimonial-author">
                    <img src={testimonial.avatar} alt={testimonial.author} className="author-avatar" />
                    <div className="author-info">
                      <div className="author-name">{testimonial.author}</div>
                      <div className="author-role">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Ultra Premium */}
      <section className="cta-section">
        <div className="cta-bg"></div>
        <div className="container">
          <div className="cta-content">
            <AnimatedCard animation="fadeIn">
              <h2>Únete a la <span className="highlight">Revolución Financiera</span></h2>
            </AnimatedCard>
            <AnimatedCard animation="fadeIn" delay={200}>
              <p>Comienza hoy mismo a disfrutar de pagos globales instantáneos y sin fronteras</p>
            </AnimatedCard>

            <AnimatedCard animation="fadeIn" delay={400}>
              <div className="cta-buttons">
                <button className="connect-button large glow-on-hover" onClick={connectWallet}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                    alt="MetaMask"
                    className="wallet-logo"
                  />
                  Conectar Wallet
                </button>
                <button className="secondary-button large">
                  <span className="button-icon">📱</span>
                  Descargar App
                </button>
              </div>
            </AnimatedCard>

            <AnimatedCard animation="fadeIn" delay={600}>
              <div className="supported-wallets">
                <span>Wallets soportadas:</span>
                <div className="wallets-container">
                  {supportedWallets.map((wallet, index) => (
                    <a key={index} href={wallet.link} className="wallet-icon" target="_blank" rel="noopener noreferrer">
                      <img src={wallet.icon} alt={wallet.name} />
                      {wallet.name}
                    </a>
                  ))}
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;