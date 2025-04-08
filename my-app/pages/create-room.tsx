import { useState } from 'react';
import { useRouter } from 'next/navigation'; //using router to get the name, can update with reference to the backend instead
import Image from 'next/image';

export default function CreateRoom() {
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleCreateRoom = () => {
    // Replace
    console.log('Creating room:', roomName, 'with password:', password);
    router.push(`/game-room?roomName=${encodeURIComponent(roomName)}`);
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
    <button onClick={handleCreateRoom}>
        Create Room
    </button>
      <Image
        src="/cards.png"
        alt="Corner image"
        width={150}
        height={150}
        style={{ position: 'fixed', bottom: '0', right: '0' }}
      />
    </div>
  );
}
