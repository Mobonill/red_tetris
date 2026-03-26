import { useState, useEffect } from 'react';
import './App.css';
import Solo from "./solo.tsx";
import Multi from "./multi.tsx";

function App() {
    const [page, setPage] = useState('home');
    const [pseudo, setPseudo] = useState('');
    const [roomName, setRoomName] = useState('');

    //url
    useEffect(() => {
        const path = window.location.pathname; 

        const parts = path.split('/').filter(Boolean); 

        if (parts.length === 2) {
            setRoomName(parts[0]);
            setPseudo(parts[1]);
            setPage('multi');
        }
    }, []);

    //url clean
    const goHome = () => {
        window.history.pushState({}, '', '/'); 
        setPage('home');
    };

    if (page === 'solo') {
        return <Solo onBack={goHome} pseudo={pseudo} />;
    }
    if (page === 'multi') {
        return <Multi onBack={goHome} pseudo={pseudo} roomName={roomName} />;
    }

    return (
        <div className="app-container">
            <div className="button-group">
                <input 
                    type="text" 
                    placeholder="Player Pseudo" 
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}/>
                <button className="menu-button" onClick={() => {
                        if (pseudo.trim() !== '') {setPage('solo');}
                        else {alert("Enter pseudo");}}}>Solo</button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Room Name" 
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}/>
                    <button className="menu-button" onClick={() => {
                        if (pseudo.trim() !== '' && roomName.trim() !== '') {
                            setPage('multi');
                            window.history.pushState({}, '', `/${roomName}/${pseudo}`);
                        }
                        else {alert("Enter pseudo and room name");}}}>Create / Join Room</button>
                </div>
            </div>
        </div>
    );
}

export default App;