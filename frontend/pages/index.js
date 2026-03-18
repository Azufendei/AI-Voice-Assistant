import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import ChatWindow from '../components/ChatWindow'
import VoiceButton from '../components/VoiceButton'
import TopicSelector from '../components/TopicSelector'
import HistorySidebar from '../components/HistorySidebar'
import { sendMessage, fetchHistory } from '../utils/api'

export default function Home() {
  const [messages, setMessages] = useState([])
  const [topic, setTopic] = useState('General')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [textInput, setTextInput] = useState('')

  const loadHistory = useCallback(async () => {
    const data = await fetchHistory()
    setHistory(data)
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const cleanForSpeech = (text) => {
  return text
    .replace(/[#*_`~=>\-]{2,}/g, ' ')   // ===, ---, ###, ``` etc.
    .replace(/[#*_`>]/g, '')              // lone markdown symbols
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [link text](url) → link text
    .replace(/\n{2,}/g, '. ')             // double newlines → pause
    .replace(/\n/g, ' ')                  // single newlines → space
    .replace(/\s{2,}/g, ' ')              // collapse extra spaces
    .trim()
}

const speak = (text) => {
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(cleanForSpeech(text))
  utter.lang = 'en-US'
  window.speechSynthesis.speak(utter)
}

  const handleMessage = async (text) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { role: 'user', text }])
    setLoading(true)
    try {
      const response = await sendMessage(text, topic === 'General' ? null : topic)
      setMessages(prev => [...prev, { role: 'assistant', text: response }])
      speak(response)
      await loadHistory()
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Something went wrong. Please try again.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleTextSubmit = (e) => {
    e.preventDefault()
    if (!textInput.trim()) return
    handleMessage(textInput)
    setTextInput('')
  }

  const stopSpeech = () => window.speechSynthesis.cancel()

  return (
    <>
      <Head>
        <title>Voice Learning Assistant</title>
      </Head>

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <HistorySidebar history={history} onClear={loadHistory} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Header */}
          <header style={{
            padding: '14px 20px',
            background: '#fff',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <span style={{ fontWeight: 700, fontSize: '17px', color: '#4f46e5' }}>
              🎓 Voice Learning Assistant
            </span>
            <TopicSelector selected={topic} onChange={setTopic} />
          </header>

          {/* Chat area */}
          <ChatWindow messages={messages} loading={loading} />

          {/* Input bar */}
          <div style={{
            padding: '14px 20px',
            background: '#fff',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            flexShrink: 0,
          }}>
            <VoiceButton onTranscript={handleMessage} disabled={loading} />

            <form
              onSubmit={handleTextSubmit}
              style={{ flex: 1, display: 'flex', gap: '8px' }}
            >
              <input
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder="Or type your question here..."
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '24px',
                  border: '1px solid #ddd',
                  fontSize: '15px',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={loading || !textInput.trim()}
                style={{
                  padding: '10px 18px',
                  borderRadius: '24px',
                  border: 'none',
                  background: '#4f46e5',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  opacity: loading || !textInput.trim() ? 0.5 : 1,
                }}
              >
                Send
              </button>
            </form>

            <button
              onClick={stopSpeech}
              title="Stop voice playback"
              style={{
                padding: '10px 14px',
                borderRadius: '24px',
                border: '1px solid #ddd',
                background: '#fff',
                fontSize: '18px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              🔇
            </button>
          </div>
        </div>
      </div>
    </>
  )
}