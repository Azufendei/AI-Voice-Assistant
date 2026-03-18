import { clearHistory } from '../utils/api'

export default function HistorySidebar({ history, onClear }) {
  const handleClear = async () => {
    if (!confirm('Clear all chat history?')) return
    await clearHistory()
    onClear()
  }

  return (
    <aside style={{
      width: '260px',
      background: '#fff',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      flexShrink: 0,
    }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontWeight: 600, fontSize: '15px' }}>History</span>
        <button
          onClick={handleClear}
          style={{
            fontSize: '12px',
            color: '#ef4444',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Clear all
        </button>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
        {history.length === 0 && (
          <p style={{ fontSize: '13px', color: '#9ca3af', padding: '8px' }}>
            No history yet
          </p>
        )}
        {history.map(item => (
          <div key={item.id} style={{
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '6px',
            background: '#f9fafb',
            fontSize: '13px',
            color: '#374151',
          }}>
            <div style={{
              fontWeight: 500,
              marginBottom: '4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {item.message}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '11px' }}>
              {new Date(item.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}