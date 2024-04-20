import React from 'react'
import GameScene from './scenes/GameScene/GameScene'
import PanelScene from './scenes/PanelScene/PanelScene'
import './App.css';
import {usePanelSizeControls} from './App.controls'
import CombinedProvider from './CombinedProvider';
import FPSStats from 'react-fps-stats'


function App() {
  
	const panelSize = usePanelSizeControls()

	return (
		<CombinedProvider>
			<FPSStats />
			<div className="app">
				<div className="game-scene">
					<GameScene />
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