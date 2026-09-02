import React, { useState } from 'react';
import { Plus, Tag, Save, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSimple = ({ products, setProducts }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', image: null });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiscountChange = (id, newDiscount) => {
    const updated = products.map(p => {
      if (p.id === id) {
        const discountVal = parseInt(newDiscount) || 0;
        const originalPrice = p.originalPrice || p.price;
        const finalPrice = originalPrice - (originalPrice * (discountVal / 100));
        return { ...p, discount: discountVal, price: finalPrice, originalPrice };
      }
      return p;
    });
    setProducts(updated);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newId = Math.max(...products.map(p => p.id)) + 1;
    const productToAdd = {
      id: newId,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category || 'Outros',
      image: newProduct.image || '/logo.png', // Uses uploaded image or fallback
      description: 'Novo produto adicionado pelo vendedor',
      flavors: []
    };
    setProducts([productToAdd, ...products]);
    setNewProduct({ name: '', price: '', category: '', image: null });
    setShowAddForm(false);
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Painel do Vendedor</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gerencie seus produtos e aplique descontos facilmente.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={18} />
          {showAddForm ? 'Cancelar' : 'Novo Produto'}
        </button>
      </div>

      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass" 
          style={{ padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}
        >
          <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit3 size={18} /> Adicionar Novo Produto
          </h2>
          <form onSubmit={handleAddProduct} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Nome do Produto</label>
              <input 
                required
                type="text" 
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }}
              />
            </div>
            <div style={{ flex: '1 1 120px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Preço (R$)</label>
              <input 
                required
                type="number" 
                step="0.01"
                value={newProduct.price}
                onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }}
              />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Categoria</label>
              <select 
                value={newProduct.category}
                onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }}
              >
                <option value="" style={{ color: 'black' }}>Selecione...</option>
                <option value="Proteínas" style={{ color: 'black' }}>Proteínas</option>
                <option value="Pré-Treino" style={{ color: 'black' }}>Pré-Treino</option>
                <option value="Creatinas" style={{ color: 'black' }}>Creatinas</option>
                <option value="Acessórios" style={{ color: 'black' }}>Acessórios</option>
                <option value="Lanches" style={{ color: 'black' }}>Lanches</option>
              </select>
            </div>
            
            <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Imagem do Produto</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ 
                    flex: 1, 
                    padding: '0.6rem', 
                    borderRadius: '8px', 
                    border: '1px solid var(--glass-border)', 
                    background: 'rgba(0,0,0,0.2)', 
                    color: 'white', 
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                />
                {newProduct.image && (
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={newProduct.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            </div>

            <div style={{ flexBasis: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
                <Save size={18} /> Salvar Produto
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="catalog-grid">
        {products.map(product => (
          <div key={product.id} className="glass" style={{ borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '150px', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', position: 'relative' }}>
              <img src={product.image} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
              <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'var(--primary-btn)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {product.category}
              </div>
            </div>
            <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', flex: 1 }}>{product.name}</h3>
              
              <div style={{ marginBottom: '1rem', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Preço Atual</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>
                {product.originalPrice && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Preço Base</span>
                    <span style={{ fontSize: '0.9rem', textDecoration: 'line-through', color: 'var(--text-secondary)' }}>
                      R$ {product.originalPrice.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag size={16} color="var(--text-secondary)" />
                <label style={{ fontSize: '0.9rem', flex: 1 }}>Desconto (%)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={product.discount || ''}
                  onChange={(e) => handleDiscountChange(product.id, e.target.value)}
                  placeholder="0"
                  style={{ 
                    width: '60px', 
                    padding: '0.4rem', 
                    borderRadius: '6px', 
                    border: '1px solid var(--glass-border)', 
                    background: 'rgba(255,255,255,0.1)', 
                    color: 'white', 
                    textAlign: 'center',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSimple;
