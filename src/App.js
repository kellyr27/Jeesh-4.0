import React from 'react'
import GameScene from './scenes/GameScene/GameScene'
import PanelScene from './scenes/PanelScene/PanelScene'
import './App.css';
import {usePanelSizeControls} from './App.controls'
import CombinedProvider from './CombinedProvider';
import FPSStats from 'react-fps-stats'


function App() {
  
	const panelSize = usePanelSizeControls()

	// When the left or right key is pressed
	const [keyboardCycle, setKeyboardCycle] = React.useState(null)
    const handleKeyPress = (e) => {
        if (e.key === 'ArrowLeft') {
            setKeyboardCycle('left')
        }
        else if (e.key === 'ArrowRight') {
            setKeyboardCycle('right')
        }
    }

	// When the keyboard cycle is completed
	const handleKeyboardCompletion = () => {
		setKeyboardCycle(null)
	}

	return (
		<CombinedProvider>
			<FPSStats />
			<div className="app" tabIndex={0} onKeyDown={handleKeyPress}>
				<div className="game-scene">
					<GameScene
						keyboardCycle={keyboardCycle}
						onKeyboardCompletion={handleKeyboardCompletion}
					/>
				</div>
				<div className="panel-scene" style={{ 
					width: `${panelSize}px`, 
					height: `${panelSize}px`,
					top: `calc(100vh - ${panelSize}px - 15px)`,
					left: `15px`,
				}}>
					<PanelScene 
						panelSize={panelSize}
					/>
				</div>
			</div>
		</CombinedProvider>
  	)
}

export default App