const TOPICS = ['General', 'Python', 'Math', 'AI']

export default function TopicSelector({ selected, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <label style={{ fontSize: '14px', color: '#555', fontWeight: 500 }}>
        Topic:
      </label>
      <select
        value={selected}
        onChange={e => onChange(e.target.value)}
        style={{
          padding: '6px 10px',
          borderRadius: '8px',
          border: '1px solid #ddd',
          fontSize: '14px',
          background: '#fff',
          cursor: 'pointer',
        }}
      >
        {TOPICS.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  )
}