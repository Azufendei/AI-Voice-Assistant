import { useEffect, useRef } from 'react'
import ChatBubble from './ChatBubble'

export default function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '24px 20px',
    }}>
      {messages.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          color: '#9ca3af',
          marginTop: '60px',
          fontSize: '15px',
        }}>
          Press the mic and ask anything!
        </div>
      )}

      {messages.map((msg, i) => (
        <ChatBubble key={i} role={msg.role} text={msg.text} />
      ))}

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
          <div style={{
            padding: '10px 16px',
            borderRadius: '18px 18px 18px 4px',
            background: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            fontSize: '20px',
            letterSpacing: '2px',
          }}>
            <span style={{ animation: 'pulse 1s infinite' }}>...</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}