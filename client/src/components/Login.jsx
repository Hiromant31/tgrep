import { useState } from 'react';

export default function Login({ onLogin }) {
  const [name, setName] = useState(localStorage.getItem('chat-user') || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name); // Просто входим под именем
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '350px' }}>
        <h2 style={{ marginTop: 0, textAlign: 'center' }}>Вход в систему</h2>
        
        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '12px', color: '#666' }}>Ваш логин:</label>
          <input 
            autoFocus
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Имя пользователя"
            style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc', display: 'block' }}
          />
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
            Далее
          </button>
        </form>
      </div>
    </div>
  );
}
