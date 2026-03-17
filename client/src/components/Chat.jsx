import { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';
import Message from './Message';

export default function Chat({ userName, roomName, onLogout, onBack }) {
    
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef();

    useEffect(() => {
    // Проверяем, что данные есть, прежде чем отправлять
    if (roomName && userName) {
      // ИСПРАВЛЕНО: отправляем ОБЪЕКТ { roomName, userName }
      socket.emit('join room', { roomName, userName });
    }

    // Слушаем ответ с историей конкретной комнаты
    socket.on('chat history', (history) => {
      setMessages(history);
    });

    // Слушаем новые сообщения только для этой комнаты
    const handler = (data) => setMessages(prev => [...prev, data]);
    socket.on('chat message', handler);

    return () => {
      socket.off('chat history');
      socket.off('chat message', handler);
    };
  }, [roomName, userName]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit('chat message', { 
        text: input, 
        authorId: userName, 
        authorName: userName,
        roomName: roomName // ПЕРЕДАЕМ ID комнаты, чтобы сервер знал куда слать
      });
      setInput('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#e5ddd5' }}>
      <div style={{ padding: '10px', background: '#195285', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 'bold' }}>Вы: {userName}</span>
            <span style={{ fontSize: '10px', opacity: 0.8 }}>Комната: {roomName}</span>
        </div>
        <button onClick={onBack}>Назад к списку</button>
        <button 
            onClick={onLogout} 
            style={{ 
                background: 'rgba(255,255,255,0.2)', 
                color: 'white', 
                border: 'none', 
                padding: '5px 12px', 
                borderRadius: '5px', 
                cursor: 'pointer' 
            }}
        >
            Выход
        </button>
      </div>
      
      <div ref={scrollRef} style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '15px' }}>
        {messages.map((msg, i) => (
          <Message 
            key={i} 
            text={msg.text} 
            isMy={msg.authorId === userName} 
            authorName={msg.authorName} 
            time={msg.time} 
          />
        ))}
      </div>

      <form onSubmit={send} style={{ padding: '10px', display: 'flex', background: '#eee', alignItems: 'center' }}>
        <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Сообщение..." 
            style={{ 
                flexGrow: 1, 
                padding: '12px 15px', 
                borderRadius: '25px', 
                border: '1px solid #ccc', 
                outline: 'none',
                fontSize: '16px' 
            }} 
        />
        <button 
            type="submit" 
            style={{ 
                marginLeft: '10px', 
                width: '45px', 
                height: '45px', 
                borderRadius: '50%', 
                background: '#007bff', 
                color: 'white', 
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
          {'>'}
        </button>
      </form>
    </div>
  );
}
