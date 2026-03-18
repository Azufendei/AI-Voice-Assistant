import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export async function sendMessage(message, topic = null) {
  const res = await api.post('/chat', { message, topic })
  return res.data.response
}

export async function fetchHistory() {
  const res = await api.get('/history')
  return res.data
}

export async function clearHistory() {
  await api.delete('/history')
}