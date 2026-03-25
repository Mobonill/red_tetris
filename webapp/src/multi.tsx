import './solo.css'
import { Routes, Route } from "react-router-dom";
import Game  from "./components/Game"

interface MultiProps {
  onBack: () => void;
}

function Multi({ onBack }: MultiProps) {

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Game mode="multi" pseudo="aa" roomName="room1"/>} />
        </Routes>
      </div>
        
    </>
  )
}

export default Multi
