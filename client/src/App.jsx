import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';

function App() {
  // Имя пользователя из localStorage
  const [user, setUser] = useState(localStorage.getItem('chat-user') || '');
  // Объект активного чата: { id: "Alex_Mac", partner: "Alex" }
  const [activeChat, setActiveChat] = useState(null);

  // Функция входа
  const login = (name) => {
    console.log("Вход под именем:", name);
    localStorage.setItem('chat-user', name);
    setUser(name);
  };

  // Функция выхода
  const logout = () => {
    console.log("Выход из системы");
    localStorage.clear();
    setUser('');
    setActiveChat(null);
    window.location.reload();
  };

  // Функция выбора чата (из Dashboard)
  const selectChat = (chatId, partnerName) => {
    console.log("Выбран чат:", chatId, "с партнером:", partnerName);
    setActiveChat({ id: chatId, partner: partnerName });
  };

  // 1. Если пользователь не ввел имя — показываем экран Логина
  if (!user) {
    return <Login onLogin={login} />;
  }

  // 2. Если имя есть, но чат не выбран — показываем Список чатов
  if (!activeChat) {
    return (
      <Dashboard 
        userName={user} 
        onSelectRoom={selectChat} 
        onLogout={logout} 
      />
    );
  }

  // 3. Если выбран конкретный чат — показываем окно переписки
  return (
    <Chat 
      userName={user} 
      partnerName={activeChat.partner}
      roomName={activeChat.id} 
      onBack={() => setActiveChat(null)} 
      onLogout={logout}
    />
  );
}

export default App;
