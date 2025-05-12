// pages/betting-room.tsx
import { useState, useEffect } from 'react';

interface BettingRoomProps {
    username: string,
    players: string[];
    currentTurn: string | null;
    pot: number;
    chipBalances: { [username: string]: number };
    sendMessage: (msg: any) => void;
    socket: WebSocket | null
}

export default function BettingRoom({ players, currentTurn, pot, chipBalances, sendMessage, username, socket }: BettingRoomProps) {
    const [localPlayers, setLocalPlayers] = useState(players);
    const [localPot, setLocalPot] = useState(pot);
    const [localChipBalances, setLocalChipBalances] = useState<{ [username: string]: number }>(chipBalances);

    const [turn, setTurn] = useState(currentTurn);
    const [winner, setWinner] = useState<string | null>(null);

    useEffect(() => {
        const socketListener = (event: MessageEvent) => {
            if (!socket) {
                return;
            }
            console.log("gurt: yo")
            const data = JSON.parse(event.data);

            if (data.type === "turn_update") {
                setLocalPlayers(data.players);
                setLocalChipBalances(data.chip_balances);
                setLocalPot(data.pot);
                setTurn(data.turn);
            }

            if (data.type === "round_over") {
                setWinner(data.winner);
                setLocalChipBalances(data.chip_balances);
                setLocalPlayers(data.players);
                setTurn(data.turn);
                setLocalPot(data.pot);
            }
        };

        socket?.addEventListener("message", socketListener);

        return () => {
            socket?.removeEventListener('message', socketListener);
        };
    }, []);

    const handleBet = () => {
        const amount = parseInt(prompt('Enter bet amount:', '0') || '0', 10);
        if (amount > 0 && amount < localChipBalances[username]) {
            sendMessage({ action: "bet", amount });
        }
    };

    const handleFold = () => {
        sendMessage({ action: "fold" });
    };

    if (winner) {
        alert("Winner is " + winner);
        setWinner(null)
    }

    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh',
            padding: '20px',
            boxSizing: 'border-box',
        }}>
            <h1 style={{ textAlign: 'center' }}>
                Poker Room
            </h1>
            <h2 style={{ textAlign: 'center' }}>
                {username}
            </h2>

            <div style={{ textAlign: 'center', margin: '40px 0' }}>
                <h2>Pot: ${localPot}</h2>
            </div>

            {turn === username && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <p><strong>Your turn!</strong></p>
                    <button onClick={handleBet} style={{
                        marginRight: '10px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#4caf50',
                        color: '#fff',
                        cursor: 'pointer',
                    }}>
                        Bet
                    </button>
                    <button onClick={handleFold} style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#f44336',
                        color: '#fff',
                        cursor: 'pointer',
                    }}>
                        Fold
                    </button>
                </div>
            )}

            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: 0,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                padding: '0 10px',
                boxSizing: 'border-box',
            }}>
                {localPlayers && localPlayers.map((p, i) => (
                    <div
                        key={i}
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            backgroundColor: p === turn ? '#ffd54f' : '#eee',
                            textAlign: 'center',
                            width: '120px',
                        }}
                    >
                        <h3>{p}</h3>
                        <p>Chips: ${localChipBalances[p]}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
