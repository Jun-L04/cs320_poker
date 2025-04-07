// app/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import CreateRoom from '@/pages/create-room';
import JoinRoom from '@/pages/join-room';
import { TypeAnimation } from "react-type-animation";

export default function Home() {
  const [view, setView] = useState<'home' | 'create' | 'join'>('home');

  // Render the Create Room page
  if (view === 'create') {
    return (
      <>
        <button className="back-button" onClick={() => setView('home')} style={{ margin: '20px', fontSize: '14px' }}>
        &larr; Back
        </button>
        <CreateRoom />
      </>
    );
  }

  // Render the Join Room page
  if (view === 'join') {
    return (
      <>
        <button className="back-button" onClick={() => setView('home')} style={{ margin: '20px', fontSize: '14px' }}>
        &larr; Back
        </button>
        <JoinRoom />
      </>
    );
  }

  // Default home page
  return (
    <>
    <header style={{ textAlign: 'center', marginBottom: '20px' }}>
      <Image src="/header.jpg" alt="Header image" width={400} height={200} style={{ objectFit: 'cover' }} />
    </header>
    <main style={{ textAlign: 'center' }}>
    <TypeAnimation
          sequence={[
            'Welcome',
            1000,
            'Hi There',
            1000,
          ]}
          wrapper="h1"
          cursor={true}
          repeat={10}
          deletionSpeed={50}
          style={{ fontSize: '2rem', marginBottom: '20px' }}
        />
      <div style={{ margin: '20px' }}>
        <button onClick={() => setView('create')} style={{ padding: '10px 20px', marginRight: '10px', fontSize: '16px' }}>
          Create Room
        </button>
        <button onClick={() => setView('join')} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Join Room
        </button>
      </div>
    </main>
  </>
);
}
