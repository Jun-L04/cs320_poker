// pages/betting-room.tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface Player {
  name: string
  chips: number
  currentBet: number
  folded: boolean
}

export default function BettingRoom() {
  const router = useRouter()
  const { roomName } = router.query

  const [players, setPlayers] = useState<Player[]>([])
  const [pool, setPool] = useState<number>(0)
  const [currentTurn, setCurrentTurn] = useState<number>(0)

  // initialize players once
  useEffect(() => {
    setPlayers([
      { name: 'Alice',   chips: 500, currentBet: 0, folded: false },
      { name: 'Bob',     chips: 500, currentBet: 0, folded: false },
      { name: 'Charlie', chips: 500, currentBet: 0, folded: false },
      { name: 'Diana',   chips: 500, currentBet: 0, folded: false },
    ])
  }, [])

  const nextTurn = () => {
    if (!players.length) return
    let next = (currentTurn + 1) % players.length
    // skip folded players
    while (players[next].folded) {
      next = (next + 1) % players.length
    }
    setCurrentTurn(next)
  }

  const handleBet = () => {
    const input = prompt('Enter bet amount:', '0')
    if (!input) return
    const amount = parseInt(input, 10)
    if (isNaN(amount) || amount <= 0) return

    setPlayers(pl =>
      pl.map((p, i) =>
        i === currentTurn
          ? {
              ...p,
              chips: Math.max(0, p.chips - amount),
              currentBet: p.currentBet + amount,
            }
          : p
      )
    )
    setPool(prev => prev + amount)
    nextTurn()
  }

  const handleFold = () => {
    setPlayers(pl =>
      pl.map((p, i) => (i === currentTurn ? { ...p, folded: true } : p))
    )
    nextTurn()
  }

  const activePlayer = players[currentTurn]

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      {/* Room Name */}
      <h1 style={{ textAlign: 'center' }}>
        Room: <strong>{roomName || '—'}</strong>
      </h1>

      {/* Pool in center */}
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2>Pool: ${pool}</h2>
      </div>

      {/*Bet & Fold for the active player */}
      {activePlayer && !activePlayer.folded && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p>
            <strong>{activePlayer.name}’s turn</strong> — Chips: ${activePlayer.chips}
          </p>
          <button
            onClick={handleBet}
            style={{
              marginRight: '10px',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#4caf50',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Bet
          </button>
          <button
            onClick={handleFold}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#f44336',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Fold
          </button>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          padding: '0 10px',
          boxSizing: 'border-box',
        }}
      >
        {players.map((p, i) => (
          <div
            key={i}
            style={{
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: i === currentTurn ? '#ffd54f' : '#eee',
              opacity: p.folded ? 0.5 : 1,
              textAlign: 'center',
              width: '120px',
            }}
          >
            <h3>{p.name}</h3>
            <p>Chips: ${p.chips}</p>
            <p>Bet: ${p.currentBet}</p>
            {p.folded && <p style={{ color: 'red' }}>Folded</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
