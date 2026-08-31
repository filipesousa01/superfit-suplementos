import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const heroProducts = [
  {
    id: 1,
    image: '/creatina-growth.png', // Center
    name: 'Creatina Monohidratada',
    brand: 'Growth',
    weight: '250g',
    role: 'center', // Main featured product
  },
  {
    id: 2,
    image: '/creatina-integralmedica.png', // Left background
    name: 'Creatina Hardcore',
    brand: 'Integralmédica',
    weight: '300g',
    role: 'left',
  },
  {
    id: 3,
    image: '/creatina-max.png', // Right background
    name: 'Creatine',
    brand: 'Max Titanium',
    weight: '300g',
    role: 'right',
  },
];

const Hero = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div style={{ 
      minHeight: '90vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '4rem 1.5rem',
      backgroundColor: 'transparent',
    }}>
      {/* Abstract Background Elements */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}>
        {/* Blurry Circles (Primary accent) */}
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '500px',
          height: '500px',
          backgroundColor: 'rgba(168, 178, 189, 0.15)',
          borderRadius: '50%',
          filter: 'blur(150px)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          width: '600px',
          height: '600px',
          backgroundColor: 'rgba(84, 91, 100, 0.1)',
          borderRadius: '50%',
          filter: 'blur(150px)',
        }} />
        
        {/* Technical Grid Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDQwIEwgNDAgNDAgTCA0MCAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNhOGIyYmQiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjE1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+")`,
          opacity: 0.3,
          zIndex: 0,
          mixBlendMode: 'overlay',
        }} />
      </div>

      <div className="container hero-grid" style={{ 
        position: 'relative', 
        zIndex: 10, 
      }}>
        
        {/* Text Content */}
        <div className="hero-text-content" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          zIndex: 20,
        }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(168, 178, 189, 0.08)',
              border: '1px solid rgba(168, 178, 189, 0.3)',
              borderRadius: '999px',
              padding: '0.25rem 0.75rem',
              marginBottom: '1rem',
            }}
          >
            <motion.span 
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ 
                width: 8, height: 8, borderRadius: '50%', 
                backgroundColor: 'var(--accent)',
              }} 
            />
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              letterSpacing: '0.1em',
              color: 'var(--accent)',
            }}>
              QUALIDADE PREMIUM GARANTIDA
            </span>
          </motion.div>

          <motion.h2
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.4 } }
            }}
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 900,
              fontFamily: "'Montserrat', sans-serif",
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
              textTransform: 'uppercase',
            }}
          >
            <motion.div style={{ 
              display: 'inline-block',
              background: 'linear-gradient(to right, #ffffff, #A8B2BD)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {"SUPERFIT".split("").map((char, index) => (
                <motion.span 
                  key={index} 
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
            <br/>
            <motion.span 
              variants={{ hidden: { opacity: 0, scale: 0.8, rotate: -2 }, visible: { opacity: 1, scale: 1, rotate: 0 } }}
              transition={{ type: 'spring', damping: 10, stiffness: 100 }}
              style={{ display: 'inline-block', fontSize: 'clamp(1.2rem, 3.5vw, 2.5rem)' }}
            >
              <motion.span
                animate={{ 
                  textShadow: [
                    '0 0 15px rgba(86, 204, 242, 0.4)', 
                    '0 0 35px rgba(86, 204, 242, 0.9)', 
                    '0 0 15px rgba(86, 204, 242, 0.4)'
                  ],
                  scale: [1, 1.02, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ 
                  color: '#56CCF2', 
                  WebkitTextFillColor: '#56CCF2',
                  fontStyle: 'italic',
                  display: 'inline-block'
                }}
              >
                TOP 1 EM PREÇO E QUALIDADE
              </motion.span>
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
              maxWidth: '500px',
            }}
          >
            Creatinas puras das melhores marcas do mercado. Desenvolvidas para máxima absorção, força explosiva e recuperação muscular rápida. Sem misturas. Sem limites.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="hero-buttons"
          >
            <motion.a 
              href="#catalog" 
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: 'var(--primary-btn)',
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 0 15px rgba(0, 100, 148, 0.4)',
                transition: 'background-color 0.3s',
              }}
            >
              Comprar Agora
            </motion.a>
            <motion.a 
              href="#catalog" 
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: 'transparent',
                border: '2px solid var(--primary-btn)',
                color: 'var(--primary-btn)',
                fontSize: '0.875rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 0.3s',
              }}
            >
              Ver Detalhes
            </motion.a>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="hero-trust-indicators"
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>100%</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Puras</span>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>3g - 5g</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Por Porção</span>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Zero</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Aditivos</span>
            </div>
          </motion.div>
        </div>

        {/* Product Showcase (3D Perspective - Stitch Style) */}
        <div className="hero-showcase" style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'clamp(400px, 60vw, 600px)',
          width: '100%',
          perspective: '1000px',
        }}>
          
          {/* Main Featured Product (Center) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.5 } }}
            className="hero-product-center"
            style={{
              position: 'absolute',
              zIndex: 30,
              width: '100%',
              maxWidth: '320px',
              cursor: 'pointer',
            }}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1/1',
              borderRadius: '50%',
              boxShadow: '0 0 40px rgba(168, 178, 189, 0.25)', // Primary glow
            }}>
              <img 
                src="/creatina-growth.png"
                alt="Creatina Growth"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.8))',
                  position: 'absolute',
                  inset: 0,
                  transition: 'transform 0.5s ease',
                }}
                draggable={false}
              />
            </div>
          </motion.div>

          {/* Secondary Product (Left Background) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, filter: 'blur(2px)', rotate: -12 }}
            animate={{ opacity: 0.6, scale: 0.75, filter: 'blur(2px)', rotate: -12 }}
            transition={{ duration: 1, delay: 0.7 }}
            whileHover={{ opacity: 1, scale: 0.8, filter: 'blur(0px)', rotate: -12, transition: { duration: 0.5 } }}
            className="hero-product-secondary"
            style={{
              position: 'absolute',
              zIndex: 20,
              left: '5%',
              top: '15%',
              width: '100%',
              maxWidth: '250px',
              cursor: 'pointer',
            }}
          >
            <img 
              src="/creatina-integralmedica.png"
              alt="Creatina Integralmédica"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
              draggable={false}
            />
          </motion.div>

          {/* Secondary Product (Right Background) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, filter: 'blur(2px)', rotate: 12 }}
            animate={{ opacity: 0.6, scale: 0.75, filter: 'blur(2px)', rotate: 12 }}
            transition={{ duration: 1, delay: 0.9 }}
            whileHover={{ opacity: 1, scale: 0.8, filter: 'blur(0px)', rotate: 12, transition: { duration: 0.5 } }}
            className="hero-product-secondary"
            style={{
              position: 'absolute',
              zIndex: 20,
              right: '5%',
              bottom: '15%',
              width: '100%',
              maxWidth: '250px',
              cursor: 'pointer',
            }}
          >
            <img 
              src="/creatina-max.png"
              alt="Creatina Max Titanium"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
              draggable={false}
            />
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default Hero;
