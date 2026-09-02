import React, { useEffect, useState } from 'react';
import WebFont from 'webfontloader';
import { ShoppingBag, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import Cart from './components/Cart';
import { CartProvider, useCart } from './context/CartContext';

// Header component needs to consume CartContext to show item count and toggle cart
const Header = ({ searchQuery, setSearchQuery, currentView, setCurrentView }) => {
  const { cartItems, toggleCart } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 30,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--glass-border)'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.8rem 1.5rem',
        gap: '0.6rem'
      }}>
        <div className="header-logo" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <img 
            src="/logo.png" 
            alt="SuperFit Suplementos" 
            style={{ 
              height: '50px',
              filter: 'brightness(0) invert(1)',
              objectFit: 'contain'
            }} 
          />
        </div>
        
        {/* Search - inline no desktop, full-width no mobile */}
        <div className="header-search" style={{ 
          flex: 1, 
          maxWidth: '500px', 
          minWidth: '180px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          order: 0
        }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Buscar suplementos..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 1rem 0.6rem 2.8rem',
              borderRadius: '999px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              outline: 'none',
              fontSize: '0.9rem',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              const catalogEl = document.getElementById('catalog');
              if (catalogEl) {
                catalogEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onBlur={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const catalogEl = document.getElementById('catalog');
                if (catalogEl) {
                  catalogEl.scrollIntoView({ behavior: 'smooth' });
                }
                e.target.blur();
              }
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          <motion.button 
            onClick={() => setCurrentView(currentView === 'store' ? 'admin' : 'store')}
            whileTap={{ scale: 0.9 }}
            style={{ 
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--glass-border)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--primary-btn)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
          >
            <span style={{ fontWeight: 600 }}>{currentView === 'store' ? 'Vendedor' : 'Voltar à Loja'}</span>
          </motion.button>

          <motion.button 
            onClick={toggleCart}
            whileTap={{ scale: 0.9 }}
            style={{ 
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--glass-border)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--primary-btn)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span style={{ 
                background: 'white', 
                color: 'var(--bg-primary)', 
                fontWeight: 800,
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem'
              }}>
                {totalItems}
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};

import AdminSimple from './components/AdminSimple';
import Login from './components/Login';
import { mockProducts } from './data/mockProducts';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState('store'); // 'store' or 'admin'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState(mockProducts);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Montserrat:700,800,900', 'Inter:400,600,700']
      }
    });
  }, []);

  return (
    <CartProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
        
        <main style={{ flex: 1, paddingTop: '70px' }}>
          {currentView === 'store' ? (
            <>
              <Hero />
              <Catalog searchQuery={searchQuery} products={products} />
            </>
          ) : isAuthenticated ? (
            <AdminSimple products={products} setProducts={setProducts} />
          ) : (
            <Login onLogin={() => setIsAuthenticated(true)} />
          )}
        </main>
        
        {currentView === 'store' && <Cart />}
        
        <footer style={{
          background: 'var(--bg-secondary)',
          padding: '3rem 0',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          borderTop: '1px solid var(--glass-border)'
        }}>
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Super Fit Suplementos. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
};

export default App;
