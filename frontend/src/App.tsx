import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface Item {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

function App() {
  const [message, setMessage] = useState('')
  const [items, setItems] = useState<Item[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const fetchItems = async () => {
    const res = await fetch(`${API_URL}/items/`)
    if (res.ok) {
      setItems(await res.json())
    }
  }

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then((r) => r.json())
      .then((data) => setMessage(data.message))
    fetchItems()
  }, [])

  const createItem = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`${API_URL}/items/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description: description || null }),
    })
    if (res.ok) {
      setName('')
      setDescription('')
      fetchItems()
    }
  }

  const deleteItem = async (id: number) => {
    const res = await fetch(`${API_URL}/items/${id}`, { method: 'DELETE' })
    if (res.ok) fetchItems()
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1>SETSS2026</h1>
      <p><strong>Backend says:</strong> {message}</p>

      <h2>Create Item</h2>
      <form onSubmit={createItem} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>

      <h2>Items</h2>
      {items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} style={{ marginBottom: 8 }}>
              <strong>{item.name}</strong>
              {item.description && <span> — {item.description}</span>}
              <button onClick={() => deleteItem(item.id)} style={{ marginLeft: 8 }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
