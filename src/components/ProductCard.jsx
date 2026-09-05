import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors && product.flavors.length > 0 ? product.flavors[0] : null);

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.97 }}
      className="glass"
      style={{
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
    >
      <motion.div 
        className="product-card-image"
        style={{
          background: 'transparent',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '220px',
          position: 'relative'
        }}
      >
        {product.discount > 0 && (
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            background: '#ef4444', // Red like Growth
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 800,
            zIndex: 20,
            boxShadow: '0 4px 10px rgba(239, 68, 68, 0.4)'
          }}>
            -{product.discount}% OFF
          </div>
        )}
        <motion.img 
          src={product.image} 
          alt={product.name} 
          whileHover={{ scale: 1.15, transition: { duration: 0.4 } }}
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%', 
            objectFit: 'contain',
            filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))',
            zIndex: 10,
            cursor: 'pointer'
          }}
        />
      </motion.div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            {product.category}
          </span>
          <h3 className="product-card-name" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3, fontFamily: "'Montserrat', sans-serif" }}>
            {product.name}
          </h3>
          <p className="product-card-desc" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
            {product.description}
          </p>
        </div>

        {product.flavors && product.flavors.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <select 
              value={selectedFlavor}
              onChange={(e) => setSelectedFlavor(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              {product.flavors.map(flavor => (
                <option key={flavor} value={flavor} style={{ background: '#1A1C1E', color: 'white' }}>
                  Sabor: {flavor}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {product.originalPrice && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'line-through', marginBottom: '-0.2rem' }}>
                R$ {product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="product-card-price" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>
              R$ {product.price.toFixed(2)}
            </span>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              em até <strong style={{ color: 'white' }}>6x de R$ {(product.price / 6).toFixed(2)}</strong> sem juros
            </div>
          </div>
          <motion.button 
            className="btn-primary" 
            whileTap={{ scale: 0.9 }}
            style={{ padding: '0.75rem', borderRadius: '50%' }}
            onClick={() => addToCart(product, selectedFlavor)}
            aria-label="Adicionar ao carrinho"
          >
            <ShoppingCart size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
