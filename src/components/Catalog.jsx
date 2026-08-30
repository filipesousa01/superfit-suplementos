import React, { useState } from 'react';
import { mockProducts } from '../data/mockProducts';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

const Catalog = ({ searchQuery = '' }) => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  
  const categories = ['Todos', ...new Set(mockProducts.map(p => p.category))];

  const filteredProducts = mockProducts.filter(p => {
    const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="catalog" style={{ padding: '5rem 0', position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', fontFamily: "'Montserrat', sans-serif", textTransform: 'uppercase' }}>Nosso Catálogo</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Produtos selecionados para máxima qualidade e performance.
          </p>
        </div>

        {/* Filters */}
        <div className="catalog-filters" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          {categories.map(category => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              whileTap={{ scale: 0.95 }}
              className={activeCategory === category ? 'btn-primary' : 'btn-secondary'}
              style={{
                background: activeCategory === category ? 'var(--primary-btn)' : 'transparent',
                border: activeCategory === category ? 'none' : '1px solid var(--glass-border)'
              }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Nenhum produto encontrado</h3>
            <p>Não encontramos suplementos para a sua busca "{searchQuery}". Tente usar outros termos!</p>
          </div>
        ) : (
          <motion.div 
            key={`${activeCategory}-${searchQuery}`}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="catalog-grid"
          >
            {filteredProducts.map(product => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Catalog;
