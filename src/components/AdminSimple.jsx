import React, { useState } from 'react';
import { Plus, Tag, Save, Edit3, Loader, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

const AdminSimple = ({ products, setProducts }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', description: '', imageFile: null, imagePreview: null });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, imagePreview: reader.result, imageFile: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiscountChange = async (id, newDiscount) => {
    const discountVal = parseInt(newDiscount) || 0;
    
    // Atualiza localmente primeiro para sensação de realtime (Optimistic UI)
    const updated = products.map(p => {
      if (p.id === id) {
        const originalPrice = p.originalPrice || p.price;
        const finalPrice = originalPrice - (originalPrice * (discountVal / 100));
        return { ...p, discount: discountVal, price: finalPrice, originalPrice };
      }
      return p;
    });
    setProducts(updated);

    // Encontra o produto atualizado para mandar pro banco
    const pToUpdate = updated.find(p => p.id === id);

    // Atualiza no banco
    if (pToUpdate) {
      const { error } = await supabase
        .from('products')
        .update({ 
          discount: pToUpdate.discount, 
          price: pToUpdate.price, 
          originalprice: pToUpdate.originalPrice || pToUpdate.originalprice 
        })
        .eq('id', id);
        
      if (error) console.error("Erro ao atualizar desconto:", error);
    }
  };

  const handleDescriptionChange = (id, newDesc) => {
    setProducts(products.map(p => p.id === id ? { ...p, description: newDesc } : p));
  };

  const handleDescriptionBlur = async (id, newDesc) => {
    const { error } = await supabase
      .from('products')
      .update({ description: newDesc })
      .eq('id', id);
    if (error) console.error("Erro ao atualizar descrição:", error);
  };

  const handlePriceChange = (id, newPriceStr) => {
    const newBasePrice = parseFloat(newPriceStr) || 0;
    
    setProducts(products.map(p => {
      if (p.id === id) {
        const discountVal = p.discount || 0;
        const finalPrice = newBasePrice - (newBasePrice * (discountVal / 100));
        return { ...p, originalPrice: newBasePrice, price: finalPrice };
      }
      return p;
    }));
  };

  const handlePriceBlur = async (id) => {
    const pToUpdate = products.find(p => p.id === id);
    if (pToUpdate) {
      const { error } = await supabase
        .from('products')
        .update({ 
          price: pToUpdate.price, 
          originalprice: pToUpdate.originalPrice 
        })
        .eq('id', id);
      if (error) console.error("Erro ao atualizar preço base:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    
    // Atualiza otimisticamente
    const previousProducts = [...products];
    setProducts(products.filter(p => p.id !== id));
    
    // Deleta do Supabase
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Não foi possível excluir o produto.");
      setProducts(previousProducts); // reverte em caso de erro
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      let imageUrl = '/logo.png'; // Fallback

      // 1. Upload da Imagem pro Supabase Storage
      if (newProduct.imageFile) {
        const fileExt = newProduct.imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, newProduct.imageFile);

        if (uploadError) {
          throw uploadError;
        }

        // Pega a URL pública
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrlData.publicUrl;
      }

      // 2. Insere no Banco de Dados
      const productToAdd = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        category: newProduct.category || 'Outros',
        image: imageUrl,
        description: newProduct.description || 'Novo produto adicionado pelo vendedor',
        flavors: []
      };

      const { data, error } = await supabase
        .from('products')
        .insert([productToAdd])
        .select();

      if (error) throw error;

      // 3. Atualiza a lista na tela
      if (data && data.length > 0) {
        setProducts([data[0], ...products]);
      } else {
        // Fallback pro otimista caso select falhe mas insert funcione
        setProducts([{...productToAdd, id: Date.now()}, ...products]);
      }

      setNewProduct({ name: '', price: '', category: '', description: '', imageFile: null, imagePreview: null });
      setShowAddForm(false);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto. Verifique se a tabela 'products' e o bucket 'product-images' existem e são públicos.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="admin-header">
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
          <form onSubmit={handleAddProduct} className="admin-form">
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

            <div style={{ flex: '1 1 100%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Pequena Descrição (Opcional)</label>
              <textarea 
                value={newProduct.description}
                onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                placeholder="Ex: Suplemento ideal para hipertrofia..."
                rows="2"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none', resize: 'vertical' }}
              />
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
                {newProduct.imagePreview && (
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={newProduct.imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            </div>

            <div style={{ flexBasis: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem', opacity: isSaving ? 0.7 : 1 }} disabled={isSaving}>
                {isSaving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                {isSaving ? 'Salvando...' : 'Salvar Produto'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="admin-catalog-grid">
        {products.map(product => (
          <div key={product.id} className="glass" style={{ borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <button 
              onClick={() => handleDeleteProduct(product.id)}
              style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', zIndex: 10, background: 'rgba(239, 68, 68, 0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              title="Excluir produto"
            >
              <Trash2 size={16} />
            </button>
            <div style={{ height: '150px', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', position: 'relative' }}>
              <img src={product.image} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
              <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'var(--primary-btn)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {product.category}
              </div>
            </div>
            <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', flex: 1 }}>{product.name}</h3>
              
              <div style={{ marginBottom: '1rem', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Preço Atual</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    Preço Base (R$)
                  </span>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    value={product.originalPrice || product.price || ''}
                    onChange={(e) => handlePriceChange(product.id, e.target.value)}
                    onBlur={() => handlePriceBlur(product.id)}
                    style={{ 
                      width: '80px', 
                      padding: '0.3rem', 
                      borderRadius: '6px', 
                      border: '1px solid var(--glass-border)', 
                      background: 'rgba(255,255,255,0.1)', 
                      color: 'white', 
                      textAlign: 'right',
                      outline: 'none',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
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

              <div style={{ marginTop: '0.8rem' }}>
                <textarea 
                  value={product.description || ''}
                  onChange={(e) => handleDescriptionChange(product.id, e.target.value)}
                  onBlur={(e) => handleDescriptionBlur(product.id, e.target.value)}
                  placeholder="Descrição do produto..."
                  rows="2"
                  style={{ 
                    width: '100%', 
                    padding: '0.6rem', 
                    borderRadius: '6px', 
                    border: '1px solid var(--glass-border)', 
                    background: 'rgba(255,255,255,0.05)', 
                    color: 'white', 
                    outline: 'none',
                    fontSize: '0.85rem',
                    resize: 'vertical'
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
