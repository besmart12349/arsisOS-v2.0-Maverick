import React, { useState, useRef, useEffect } from 'react';

const MOCK_CONTACTS = [
  { id: 1, name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice' },
  { id: 2, name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob' },
  { id: 3, name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=charlie' },
  { id: 4, name: 'Diana', avatar: 'https://i.pravatar.cc/150?u=diana' },
];

type View = 'list' | 'call';

const Contacts: React.FC = () => {
  const [view, setView] = useState<View>('list');
  const [calling, setCalling] = useState<{ name: string; avatar: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (view === 'call') {
      const getCamera = async () => {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          alert("Could not access camera. Please ensure permissions are granted.");
          setView('list'); // Go back if no camera
        }
      };
      getCamera();
    } else {
      stream?.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const startCall = (contact: { id: number; name: string; avatar: string }) => {
    setCalling(contact);
    setView('call');
  };

  const endCall = () => {
    setView('list');
    setCalling(null);
  };
  
  if (view === 'call' && calling) {
    return (
      <div className="w-full h-full bg-black flex flex-col items-center justify-between text-white p-4">
        <div className="text-center">
            <p className="text-lg font-semibold">{calling.name}</p>
            <p className="text-sm text-gray-400">Calling...</p>
        </div>
        <div className="relative w-[320px] h-[240px] rounded-lg overflow-hidden bg-gray-900 my-4">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        </div>
        <button onClick={endCall} className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 12h2m4 0h2m4 0h2M3 20l3-3m0 0l3-3m-3 3l-3-3m3 3v-3m0 6l-3-3m0 0l-3-3m3 3l3 3m-3 3v-3" /></svg>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-800">
      <header className="p-2 border-b bg-gray-200 dark:bg-gray-900 text-center">
        <h1 className="font-semibold text-gray-800 dark:text-gray-200">Contacts</h1>
      </header>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {MOCK_CONTACTS.map(contact => (
          <li key={contact.id} className="p-2 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-700">
            <div className="flex items-center space-x-3">
              <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full" />
              <span className="font-medium text-gray-800 dark:text-gray-200">{contact.name}</span>
            </div>
            <button onClick={() => startCall(contact)} className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts;