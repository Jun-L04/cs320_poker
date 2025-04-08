import { useRouter } from 'next/router';
import Image from 'next/image';
import { useState } from 'react';
import { Carter_One } from 'next/font/google';

const carterOne = Carter_One({
  subsets: ['latin'],
  weight: '400', 
});

export default function GameRoom() {
  const router = useRouter();
  const { roomName } = router.query;
  const [players] = useState<string[]>(['player1', 'player2', 'player3','player4',]); //dummy player list
  const handleStartGame = () => {
    // Replace
    console.log('Game started!');
    alert('Game started!');
  };

  return (
    <div
    style={{
      padding: '20px',
      textAlign: 'center',
      position: 'relative',
    }}
  >
    {roomName ? (
    <p>
        <h1 className={carterOne.className} style={{ fontSize: '3rem' }}>Welcome to  <strong>{roomName}</strong></h1>
    </p>
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
    <button onClick={handleStartGame}>
        Start Game
    </button>
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
          height: 'auto'
        }}
      />
    </div>
  );
}
