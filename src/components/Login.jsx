import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'filipe2006.10') {
      setError('');
      onLogin();
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form_front">
          <div className="form_details">Acesso Restrito</div>
          
          {error && (
            <div style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              {error}
            </div>
          )}

          <input 
            placeholder="Usuário" 
            className="login-input" 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
          <input 
            placeholder="Senha" 
            className="login-input" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button type="submit" className="login-btn">Entrar</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
