import { useState } from 'react';
import Image from 'next/image';

export default function JoinRoom() {
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');

  const handleJoinRoom = () => {
    // Replace with actual logic
    console.log('Joining room:', roomName, 'with password:', password);
    alert(`Joining room "${roomName}"`);
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
      <h1>Join a Game Room</h1>
      <input
        type="text"
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        style={{
          display: 'block',
          margin: '10px auto',
          padding: '8px',
          fontSize: '16px',
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          display: 'block',
          margin: '10px auto',
          padding: '8px',
          fontSize: '16px',
        }}
      />
      <button
        onClick={handleJoinRoom}
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        Join Room
      </button>

      {/* Image at bottom right */}
      <Image
        src="/cards.png"
        alt="Corner image"
        width={100}
        height={100}
        style={{ position: 'fixed', bottom: '0', right: '0' }}
      />
    </div>
  );
}
