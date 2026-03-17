import { useState, useEffect } from 'react';
import { socket } from '../socket';

export default function Dashboard({ userName, onSelectRoom, onLogout }) {
  const [chats, setChats] = useState([]);
  const [searchNick, setSearchNick] = useState('');

  useEffect(() => {
    // Сразу запрашиваем список при входе
    socket.emit('get my rooms', userName);

    socket.on('rooms list', (list) => setChats(list));
    socket.on('rooms updated', () => socket.emit('get my rooms', userName));

    return () => {
      socket.off('rooms list');
      socket.off('rooms updated');
    };
  }, [userName]);

  const startChat = (e) => {
    e.preventDefault();
    const partner = searchNick.trim();
    if (partner && partner !== userName) {
      // КРИТИЧНО: сортировка имен, чтобы ID был одинаков у обоих
      const chatId = [userName, partner].sort().join('_');
      // Переходим в чат
      onSelectRoom(chatId, partner);
      setSearchNick('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3>Чаты {userName}</h3>
        <button onClick={onLogout}>Выход</button>
      </div>

      <form onSubmit={startChat} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          placeholder="Ник собеседника" 
          value={searchNick} 
          onChange={(e) => setSearchNick(e.target.value)} 
          style={{ flexGrow: 1, padding: '10px' }}
        />
        <button type="submit">Написать</button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {chats.length === 0 ? <p>Нет активных переписок</p> : chats.map(chatId => {
          const partner = chatId.split('_').find(name => name !== userName);
          return (
            <div 
              key={chatId} 
              onClick={() => onSelectRoom(chatId, partner)}
              style={{ padding: '15px', background: '#f9f9f9', borderRadius: '8px', cursor: 'pointer', border: '1px solid #ddd' }}
            >
              <strong>{partner}</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}
