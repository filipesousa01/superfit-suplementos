import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { cartItems, isCartOpen, toggleCart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    deliveryMethod: 'entrega',
    street: '',
    number: '',
    neighborhood: '',
    paymentMethod: 'pix'
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (formData.deliveryMethod === 'entrega') {
      if (!formData.street.trim()) newErrors.street = 'Obrigatório';
      if (!formData.number.trim()) newErrors.number = 'Obrigatório';
      if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Obrigatório';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = () => {
    if (!validateForm()) return;

    const phone = "5598984886836";
    let text = "📦 *NOVO PEDIDO - SUPER FIT*%0A%0A";
    
    // Dados do cliente
    text += `*Cliente:* ${formData.name}%0A`;
    text += `*Tipo:* ${formData.deliveryMethod === 'entrega' ? 'Entrega em Domicílio' : 'Retirada na Loja'}%0A`;
    if (formData.deliveryMethod === 'entrega') {
      text += `*Endereço:* ${formData.street}, ${formData.number} - ${formData.neighborhood}%0A`;
    }
    const paymentMap = { pix: 'PIX', cartao: 'Cartão (até 6x sem juros)', dinheiro: 'Dinheiro' };
    text += `*Pagamento:* ${paymentMap[formData.paymentMethod]}%0A%0A`;

    // Resumo
    text += `*Resumo do Pedido:*%0A`;
    cartItems.forEach(item => {
      const flavorText = item.selectedFlavor ? `(${item.selectedFlavor}) ` : '';
      text += `- ${item.quantity}x ${item.name} ${flavorText}(R$ ${item.price.toFixed(2)})%0A`;
    });
    
    text += `%0A*Total:* R$ ${getCartTotal().toFixed(2)}`;
    
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const inputStyle = {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--glass-border)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'inherit',
    marginBottom: '0.5rem'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="cart-overlay"
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 40
            }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="glass"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100%',
              width: '100%',
              maxWidth: '400px',
              zIndex: 50,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 600 }}>
                {isCheckoutMode ? (
                  <>
                    <button 
                      onClick={() => setIsCheckoutMode(false)}
                      style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> Voltar
                    </button>
                  </>
                ) : (
                  <><ShoppingBag /> Meu Carrinho</>
                )}
              </h2>
              <button onClick={toggleCart} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
              {!isCheckoutMode ? (
                // VIEW: CART ITEMS
                cartItems.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', marginTop: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem' }}>
                      Seu carrinho está vazio.
                    </p>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleCart}
                      className="btn-secondary"
                      style={{ padding: '0.75rem 2rem' }}
                    >
                      Continuar comprando
                    </motion.button>
                  </div>
                ) : (
                  cartItems.map(item => (
                    <div key={item.cartItemId} style={{ display: 'flex', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
                      <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'contain', background: 'white', borderRadius: '8px' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: item.selectedFlavor ? '0.2rem' : '0.5rem' }}>{item.name}</h4>
                        {item.selectedFlavor && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                            Sabor: {item.selectedFlavor}
                          </span>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, color: 'var(--accent)' }}>R$ {item.price.toFixed(2)}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', borderRadius: '999px', padding: '0.2rem' }}>
                            <button onClick={() => updateQuantity(item.cartItemId, -1)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '0.2rem' }}><Minus size={14}/></button>
                            <span style={{ fontSize: '0.9rem', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.cartItemId, 1)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '0.2rem' }}><Plus size={14}/></button>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.cartItemId)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', cursor: 'pointer' }}>
                          Remover
                        </button>
                      </div>
                    </div>
                  ))
                )
              ) : (
                // VIEW: CHECKOUT FORM
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Nome Completo *</label>
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={handleInputChange}
                      style={{ ...inputStyle, borderColor: errors.name ? '#ef4444' : 'var(--glass-border)' }}
                    />
                    {errors.name && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.name}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Método de Recebimento *</label>
                    <select 
                      name="deliveryMethod"
                      value={formData.deliveryMethod}
                      onChange={handleInputChange}
                      style={selectStyle}
                    >
                      <option value="entrega" style={{ background: '#1A1C1E' }}>Entrega em Domicílio</option>
                      <option value="retirada" style={{ background: '#1A1C1E' }}>Retirada na Loja</option>
                    </select>
                  </div>

                  {formData.deliveryMethod === 'entrega' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Rua *</label>
                        <input 
                          type="text" 
                          name="street"
                          placeholder="Nome da rua"
                          value={formData.street}
                          onChange={handleInputChange}
                          style={{ ...inputStyle, borderColor: errors.street ? '#ef4444' : 'var(--glass-border)', marginBottom: 0 }}
                        />
                        {errors.street && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.street}</span>}
                      </div>

                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Número *</label>
                          <input 
                            type="text" 
                            name="number"
                            placeholder="Ex: 123"
                            value={formData.number}
                            onChange={handleInputChange}
                            style={{ ...inputStyle, borderColor: errors.number ? '#ef4444' : 'var(--glass-border)', marginBottom: 0 }}
                          />
                          {errors.number && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.number}</span>}
                        </div>

                        <div style={{ flex: 2 }}>
                          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Bairro *</label>
                          <input 
                            type="text" 
                            name="neighborhood"
                            placeholder="Ex: Centro"
                            value={formData.neighborhood}
                            onChange={handleInputChange}
                            style={{ ...inputStyle, borderColor: errors.neighborhood ? '#ef4444' : 'var(--glass-border)', marginBottom: 0 }}
                          />
                          {errors.neighborhood && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.neighborhood}</span>}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Forma de Pagamento *</label>
                    <select 
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      style={selectStyle}
                    >
                      <option value="pix" style={{ background: '#1A1C1E' }}>PIX</option>
                      <option value="cartao" style={{ background: '#1A1C1E' }}>Cartão (em até 6x sem juros)</option>
                      <option value="dinheiro" style={{ background: '#1A1C1E' }}>Dinheiro</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
                  <span>Total:</span>
                  <span>R$ {getCartTotal().toFixed(2)}</span>
                </div>
                
                {!isCheckoutMode ? (
                  <>
                    <motion.button 
                      whileTap={{ scale: 0.95 }} 
                      className="btn-primary" 
                      onClick={() => setIsCheckoutMode(true)} 
                      style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginBottom: '0.75rem' }}
                    >
                      Finalizar Pedido
                    </motion.button>
                    <motion.button 
                      whileTap={{ scale: 0.95 }} 
                      className="btn-secondary" 
                      onClick={toggleCart} 
                      style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                    >
                      Continuar comprando
                    </motion.button>
                  </>
                ) : (
                  <motion.button 
                    whileTap={{ scale: 0.95 }} 
                    className="btn-primary" 
                    onClick={handleCheckout} 
                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: '#25D366' }} // WhatsApp Green
                  >
                    Enviar Pedido por WhatsApp
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
