import './solo.css'
import { Routes, Route } from "react-router-dom";
import Game  from "./components/Game"

interface MultiProps {
  onBack: () => void;
  pseudo:string;
  roomName: string;
}

function Multi({ onBack , roomName , pseudo }: MultiProps) {

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Game mode="multi" pseudo={pseudo} roomName={roomName}/>} />
        </Routes>
      </div>
        
    </>
  )
}

export default Multi;
