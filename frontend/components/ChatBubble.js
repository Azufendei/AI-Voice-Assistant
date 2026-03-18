export default function ChatBubble({ role, text }) {
  const isUser = role === 'user'

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '12px',
    }}>
      <div style={{
        maxWidth: '70%',
        padding: '10px 14px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? '#4f46e5' : '#ffffff',
        color: isUser ? '#ffffff' : '#1a1a1a',
        fontSize: '15px',
        lineHeight: '1.5',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        whiteSpace: 'pre-wrap',
      }}>
        {text}
      </div>
    </div>
  )
}