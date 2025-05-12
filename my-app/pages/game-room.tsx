import { useRouter } from 'next/router';
import Image from 'next/image';
import { useState } from 'react';
import { Carter_One } from 'next/font/google';
import { useWebSocket } from '@/hooks/useWebSockets';
import BettingRoom from './betting-room';

const carterOne = Carter_One({
  subsets: ['latin'],
  weight: '400',
});

export default function GameRoom() {
  const router = useRouter();
  const { roomId, username, isCreator } = router.query;

  const [gameStarted, setGameStarted] = useState(false); // ✅ track transition
  const [turn, setTurn] = useState<string | null>(null);
  const [pot, setPot] = useState(0);
  const [chipBalances, setChipBalances] = useState<{ [username: string]: number }>({});
  const [playerList, setPlayerList] = useState<string[]>([]); // for use after start

  const path = roomId && username && isCreator ? `${roomId}/${username}/${isCreator}` : null;

  const { players, sendMessage, socket } = useWebSocket(path, (data) => {
    if (data.type === "game_started") {
      setPlayerList(data.players);
      setTurn(data.turn)
      setPot(data.pot);
      setChipBalances(data.chip_balances);
      setGameStarted(true);
    }
  });
  const handleStartGame = () => {
    sendMessage({ action: "start_game" });
  };

  if (gameStarted && playerList.length > 0) {
    return (
      <BettingRoom
        username={username as string}
        players={playerList}
        currentTurn={turn}
        pot={pot}
        chipBalances={chipBalances}
        sendMessage={sendMessage}
        socket={socket}
      />
    );
  }

  return (
    <div
      style={{
        padding: '20px',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {roomId ? (
        <h1 className={carterOne.className} style={{ fontSize: '3rem' }}>Welcome to  <strong>{roomId}</strong></h1>
      ) : (
        <p>No room name provided.</p>
      )}

      <div
        style={{
          marginTop: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2>Players: </h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {players.map((player, index) => (
            <li key={index} style={{ margin: '8px 0', fontSize: '18px' }}>
              {player}
            </li>
          ))}
        </ul>
      </div>
      {isCreator === 'True' && (
        <button onClick={handleStartGame}>Start Game</button>
      )}
      <Image
        src="/cards-chips.png"
        alt="Bottom center image"
        width={2000}
        height={1000}
        style={{
          position: 'fixed',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: 'auto',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
