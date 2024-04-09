import React, {useState, useEffect, useRef} from 'react'
import GameScene from './scenes/GameScene'
import PanelScene from './scenes/PanelScene'
import './App.css';
import { useControls, folder } from 'leva';
import { INITIAL_SOLDIERS, ARENA_LENGTH} from './globals';
import {generateStarPositions} from './utils/displayHelpers'


// Temporary function to be replaced
const getAllowedPositions = () => {

	return [
		[-1, -1, -1],
		[-1, -1, 0],
		[-1, -1, 1],
		[-1, 0, -1],
		[-1, 0, 0], 
		[-1, 0, 1],
		[-1, 1, -1],
		[-1, 1, 0],
		[-1, 1, 1],
		[0, -1, -1],
		[0, -1, 0],
		[0, -1, 1],
		[0, 0, -1],
		[0, 0, 1],
		[0, 1, -1],
		[0, 1, 0],
		[0, 1, 1],
		[1, -1, -1],
		[1, -1, 0],
		[1, -1, 1],
		[1, 0, -1],
		[1, 0, 0],
		[1, 0, 1],
		[1, 1, -1],
		[1, 1, 0],
		[1, 1, 1],
	]
}

const getAllowedPositions2 = (starPositions, soldierPositions) => {

}

function App() {

	const [soldiers, setSoldiers] = useState(INITIAL_SOLDIERS);

	// TODO: Update to soldierPositions
	const starPositions = useRef(generateStarPositions(soldiers))

	const [hoveredSoldier, setHoveredSoldier] = useState(null)
    const [selectedSoldier, setSelectedSoldier] = useState(null)
	const [allowedPositions, setAllowedPositions] = useState([])
	const [isPanelLocked, setIsPanelLocked] = useState(false);
	const [currentHoveredPose, setCurrentHoveredPose] = useState(null);
    const [currentSelectedPose, setCurrentSelectedPose] = useState(null);
	const [movingModeActivate, setMovingModeActivate] = useState(false)
	const [movingModeDeactivate, setMovingModeDeactivate] = useState(false)
  
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

	/**
	 * Update the allowedPositions when a Soldier is selected
	 */
	useEffect(() => {
		setAllowedPositions(getAllowedPositions())
	}, [selectedSoldier])

	/**
	 * When the Selection Panel is selected, activate moving mode
	 */
	useEffect(() => {
		if (currentSelectedPose) {
			setMovingModeActivate(true)
		}
	}, [currentSelectedPose])

	/**
	 * When the moving Mode ends, 
	 * - Reset the selected Soldier and the currentSelectedPose
	 * - Update the previously Selected Soldier with the new gamePosition and direction
	 */
	useEffect(() => {
		if (movingModeDeactivate) {
			// Update the selected soldiers new gamePosition and direction
			if (selectedSoldier && currentSelectedPose) {
				const updatedSoldiers = soldiers.map(soldier => {
					if (soldier.id === selectedSoldier.id) {
						return {
							...soldier,
							gamePosition: currentSelectedPose.position,
							direction: currentSelectedPose.direction
						}
					} else {
						return soldier
					}
				})

				setSoldiers(updatedSoldiers)
			}

			setSelectedSoldier(null)
			setCurrentSelectedPose(null)
		}
	}, [movingModeDeactivate, selectedSoldier, currentSelectedPose, soldiers])

	/**
	 * Set movingModeDeactivate to false when all conditions are met
	 */
	useEffect(() => {
		if (!selectedSoldier && !currentSelectedPose, movingModeDeactivate) {
			setMovingModeDeactivate(false)
		}
	}, [selectedSoldier, currentSelectedPose, movingModeDeactivate])

	/**
	 * Update the selection Panel Lock status based on the movingMode and selectedSoldier
	 * When moving or no soldier is selected, lock the panel
	 */
	useEffect(() => {
		if (movingModeActivate || !selectedSoldier) {
			setIsPanelLocked(true)
		} else {
			setIsPanelLocked(false)
		}
	}, [movingModeActivate, selectedSoldier])

	return (
		<div className="app">
			<div className="game-scene">
				<GameScene
					hoveredSoldier={hoveredSoldier}
					setHoveredSoldier={setHoveredSoldier}
					selectedSoldier={selectedSoldier}
					setSelectedSoldier={setSelectedSoldier}
					currentSelectedPose={currentSelectedPose}
					setCurrentSelectedPose={setCurrentSelectedPose}
					soldiers={soldiers}
					setSoldiers={setSoldiers}
					movingModeActivate={movingModeActivate}
					setMovingModeActivate={setMovingModeActivate}
					movingModeDeactivate={movingModeDeactivate}
					setMovingModeDeactivate={setMovingModeDeactivate}
					starPositions={starPositions}
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