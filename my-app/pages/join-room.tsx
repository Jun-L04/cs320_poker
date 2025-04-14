import { useEffect, useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSockets';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function JoinRoom() {
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');

  const handleJoinRoom = () => {
    // Replace with actual logic
    console.log('Joining room:', roomName, 'with password:', password);
    alert(`Joining room "${roomName}"`);
  };
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const path = submitted ? `${roomId}/${username}/False` : null;
  const { players } = useWebSocket(
    path
  );

  const handleJoin = () => {
    if (roomId && username) {
      setSubmitted(true);
    }
  };

  useEffect(() => {
    if (submitted) {
      setSubmitted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, username]);

  useEffect(() => {
    if (players.length !== 0) {
      const queryParams = new URLSearchParams({
        roomId,
        username,
        isCreator: 'False',
      }).toString();
      router.push(`/game-room?${queryParams}`);
    }
  }, [players, submitted]);


  return (
    <div
      style={{
        padding: '20px',
        textAlign: 'center',
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <h1>Join a Game Room</h1>
      <input
        type="text"
        placeholder="Room Name"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{
          display: 'block',
          margin: '10px auto',
          padding: '8px',
          fontSize: '16px',
        }}
      />
      <input
        type="username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          display: 'block',
          margin: '10px auto',
          padding: '8px',
          fontSize: '16px',
        }}
      />
      {<button
        onClick={handleJoin}
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        Join Room
      </button>}
      <Image
        src="/cards.png"
        alt="Corner image"
        width={150}
        height={150}
        style={{ position: 'fixed', bottom: '0', right: '0' }}
      />
      {/* {submitted && (
        <>
          <h2>Players in Room:</h2>
          <ul>
            {players.map((player) => (
              <li key={player}>{player}</li>
            ))}
          </ul>
        </>
      )} */}
    </div>
  );
}
