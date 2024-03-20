import React, { useRef } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import GameScene from './scenes/GameScene/GameScene'


function App() {
  return (
    <>
      <GameScene />
    </>
  )
}

export default App