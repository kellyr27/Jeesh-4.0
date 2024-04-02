import React, {useState, useEffect} from 'react'
import GameScene from './scenes/GameScene'
import PanelScene from './scenes/PanelScene'
import './App.css';
import { useControls, folder } from 'leva';


// Temporary function to be replaced
const getAllowedPositions = () => {
	// const allowedPositions = [[
	// 	[1,0,1],
	// 	[-1,0,-1],
	// 	[1,0,0],
	// 	[0,-1,-1],
	// ], [
	// 	[1,1,1],
    //     [1,0,-1],
    //     [1,1,0],
    //     [0,0,-1],
	// 	[-1,-1,-1],
	// 	[1,0,0]
	// ]]
	
	// const randomIndex = Math.floor(Math.random() * allowedPositions.length);

	// return allowedPositions[randomIndex];

	return [
		[-1, -1, 1],
		[-1, 0, 1],
		[-1, 1, 1],
		[0, -1, 1],
		[0, 0, 1],
		[0, 1, 1],
		[1, -1, 1],
		[1, 0, 1],
		[1, 1, 1]
	]
}

function App() {

	const [hoveredSoldier, setHoveredSoldier] = useState(null)
    const [selectedSoldier, setSelectedSoldier] = useState(null)
	const [allowedPositions, setAllowedPositions] = useState([])
	const [isPanelLocked, setIsPanelLocked] = useState(false);
	const [currentHoveredPose, setCurrentHoveredPose] = useState(null);
    const [currentSelectedPose, setCurrentSelectedPose] = useState(null);
	const [movingMode, setMovingMode] = useState(false)
  
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


	useEffect(() => {
		if (selectedSoldier) {
			setIsPanelLocked(false)
			setAllowedPositions(getAllowedPositions())

		} else {
			setIsPanelLocked(true)
		}
	}, [selectedSoldier])

	/**
	 * When the Selection Panel is selected
	 */
	useEffect(() => {
		if (currentSelectedPose) {
			setMovingMode(true)
		}

	}, [currentSelectedPose])

	useEffect(() => {
		if (movingMode || !selectedSoldier) {
			setIsPanelLocked(true)
		} else {
			setIsPanelLocked(false)
		}
	}, [movingMode, selectedSoldier])

	return (
		<div className="app">
			<div className="game-scene">
				<GameScene
					hoveredSoldier={hoveredSoldier}
					setHoveredSoldier={setHoveredSoldier}
					selectedSoldier={selectedSoldier}
					setSelectedSoldier={setSelectedSoldier}
					movingMode={movingMode}
					setMovingMode={setMovingMode}
					currentSelectedPose={currentSelectedPose}
					setCurrentSelectedPose={setCurrentSelectedPose}
				/>
			</div>
			<div className="panel-scene" style={{ width: panelSize, height: panelSize }}>
				<PanelScene 
					panelSize={panelSize}
					allowedPositions={allowedPositions}
					setAllowedPositions={setAllowedPositions}
					isPanelLocked={isPanelLocked}
					setIsPanelLocked={setIsPanelLocked}
					currentHoveredPose={currentHoveredPose}
					setCurrentHoveredPose={setCurrentHoveredPose}
					currentSelectedPose={currentSelectedPose}
					setCurrentSelectedPose={setCurrentSelectedPose}
				/>
			</div>
		</div>
  	)
}

export default App