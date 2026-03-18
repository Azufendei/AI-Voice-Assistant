import { useState, useEffect, useRef, useCallback } from 'react'

const HOLD_THRESHOLD_MS = 300 // under 300ms = click/toggle, over = hold-to-talk

export default function VoiceButton({ onTranscript, disabled }) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const [mode, setMode] = useState(null) // 'toggle' | 'hold'

  const recognitionRef = useRef(null)
  const resultsRef = useRef([])
  const pressTimeRef = useRef(null)
  const manualStopRef = useRef(false)

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = true
    recognition.continuous = true

    recognition.onresult = (e) => {
      resultsRef.current = e.results
    }

    recognition.onend = () => {
      setListening(false)
      setMode(null)
      if (manualStopRef.current) {
        const transcript = Array.from(resultsRef.current)
          .map(r => r[0].transcript)
          .join('')
          .trim()
        manualStopRef.current = false
        if (transcript) onTranscript(transcript)
      }
    }

    recognition.onerror = (e) => {
      if (e.error === 'no-speech') return
      console.error('Speech error:', e.error)
      setListening(false)
      setMode(null)
      manualStopRef.current = false
    }

    recognitionRef.current = recognition
  }, [onTranscript])

  const startRecognition = useCallback(() => {
    if (!recognitionRef.current || disabled) return
    resultsRef.current = []
    manualStopRef.current = false
    try {
      recognitionRef.current.start()
      setListening(true)
    } catch (e) {
      console.error('Could not start recognition:', e)
    }
  }, [disabled])

  const stopRecognition = useCallback(() => {
    if (!recognitionRef.current) return
    manualStopRef.current = true
    recognitionRef.current.stop()
  }, [])

  const handlePressStart = useCallback((e) => {
    e.preventDefault()
    if (disabled) return
    pressTimeRef.current = Date.now()

    if (listening) {
      // already on in toggle mode — stop it
      stopRecognition()
      return
    }

    startRecognition()
  }, [disabled, listening, startRecognition, stopRecognition])

  const handlePressEnd = useCallback((e) => {
    e.preventDefault()
    if (!pressTimeRef.current) return

    const held = Date.now() - pressTimeRef.current
    pressTimeRef.current = null

    if (held >= HOLD_THRESHOLD_MS) {
      // hold mode — release = stop
      setMode('hold')
      stopRecognition()
    } else {
      // short tap = toggle mode — keep listening until tapped again
      setMode('toggle')
    }
  }, [stopRecognition])

  if (!supported) {
    return (
      <div style={{ fontSize: '12px', color: '#ef4444' }}>
        Use Chrome for mic support
      </div>
    )
  }

  const label = !listening
    ? 'tap or hold'
    : mode === 'hold'
    ? 'release to send'
    : 'tap to stop'

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      flexShrink: 0,
    }}>
      <button
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={() => {
          if (listening && mode === 'hold') stopRecognition()
        }}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        disabled={disabled}
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          border: listening ? '3px solid #ef4444' : '3px solid transparent',
          background: listening ? '#fee2e2' : '#4f46e5',
          color: listening ? '#ef4444' : '#fff',
          fontSize: '22px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.15s ease',
          boxShadow: listening
            ? '0 0 0 4px rgba(239,68,68,0.2)'
            : '0 2px 6px rgba(79,70,229,0.3)',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {listening ? '🔴' : '🎤'}
      </button>
      <span style={{
        fontSize: '10px',
        color: listening ? '#ef4444' : '#9ca3af',
        fontWeight: 500,
        userSelect: 'none',
      }}>
        {label}
      </span>
    </div>
  )
}