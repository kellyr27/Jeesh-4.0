import React from 'react'
import GameScene from './scenes/GameScene'
import PanelScene from './scenes/PanelScene'
import './App.css';
import usePanelSizeControls from './controls/usePanelSizeControls'
import CombinedProvider from './CombinedProvider';
function App() {
  
	const panelSize = usePanelSizeControls()

	return (
		<CombinedProvider>
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