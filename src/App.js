import React from 'react'
import GameScene from './scenes/GameScene'
import PanelScene from './scenes/PanelScene'
import './App.css';
import { useControls, folder } from 'leva';

function App() {
  
	const { panelSize } = useControls('Selection Panel', {
		'Size Adjustments': folder({
			panelSize: {
				value: 250,
				min: 100,
				max: 500,
				step: 1
			}
		})
	});

	return (
		<div className="app">
			<div className="game-scene">
				<GameScene />
			</div>
			<div className="panel-scene" style={{ width: panelSize, height: panelSize }}>
				<PanelScene 
					panelSize={panelSize}
				/>
			</div>
		</div>
  	)
}

export default App