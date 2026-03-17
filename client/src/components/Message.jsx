export default function Message({ text, isMy, authorName, time }) {
  return (
    <div style={{
      alignSelf: isMy ? 'flex-end' : 'flex-start',
      background: isMy ? '#c6e0f8' : 'white',
      padding: '6px 12px',
      borderRadius: '10px',
      marginBottom: '8px',
      maxWidth: '75%',
      boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
      position: 'relative'
    }}>
      {!isMy && <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#075e54' }}>{authorName}</div>}
      <div style={{ fontSize: '15px', marginRight: '40px' }}>{text}</div>
      <div style={{ 
        fontSize: '10px', 
        color: '#888', 
        position: 'absolute', 
        bottom: '4px', 
        right: '8px' 
      }}>{time}</div>
    </div>
  );
}
