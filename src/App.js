import React from 'react'
import GameScene from './scenes/GameScene/GameScene'
import PanelScene from './scenes/PanelScene/PanelScene'
import './App.css';

function App() {
  return (
    <div className="app">
        <div className="game-scene">
            <GameScene />
        </div>
        <div className="panel-scene">
            <PanelScene />
        </div>
    </div>
  )
}

export default App