import { useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSockets';
import Image from 'next/image';

export default function CreateRoom() {
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateRoom = () => {
    // Replace with actual logic
    console.log('Creating room:', roomName, 'with password:', password);
    alert(`Room "${roomName}" created!`);
  };
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const path = submitted ? `${roomId}/${username}/True` : null
  const { players } = useWebSocket(
    path
  );

  const handleCreate = () => {
    if (roomId && username) {
      setSubmitted(true);
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        textAlign: 'center',
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <h1>Create a Game Room</h1>
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
      {!submitted ? <button onClick={handleCreate}>
        Create Room
      </button> : <></>}
      <Image
        src="/cards.png"
        alt="Corner image"
        width={150}
        height={150}
        style={{ position: 'fixed', bottom: '0', right: '0' }}
      />

      {submitted && (
        <>
          <h2>Players in Room:</h2>
          <ul>
            {players.map((player) => (
              <li key={player}>{player}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
