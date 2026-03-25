import './solo.css'
import { Routes, Route } from "react-router-dom";
import Game  from "./components/Game"

interface MultiProps {
  onBack: () => void;
  roomName: string;
}

function Multi({ onBack , roomName }: MultiProps) {

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Game mode="multi" pseudo="aa" roomName={roomName}/>} />
        </Routes>
      </div>
        
    </>
  )
}

export default Multi;
