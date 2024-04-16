import React, {useState, useEffect} from 'react'
import GameScene from './scenes/GameScene'
import PanelScene from './scenes/PanelScene'
import './App.css';
import { useControls, folder } from 'leva';
import { INITIAL_SOLDIERS } from './globals';
import {generateStarPositions} from './utils/displayHelpers'
import {addArrays, subtractArrays, equalArrays} from './utils/arrayHelpers'
import {SelectionPanelInteractionProvider} from './context/SelectionPanelInteractionContext'

// Temporary function to be replaced
const getAllowedPositions = (selectedSoldierPosition, starPositions, soldierPositions) => {

	const allRelativeSurroundingPositions = []

	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			for (let k = -1; k <= 1; k++) {
				if (!(i === 0 && j === 0 && k === 0)) {
					allRelativeSurroundingPositions.push([i, j, k])
				}
			}
		}
	}

	const allSurroundingPositions = allRelativeSurroundingPositions.map((position) => {
		return addArrays(selectedSoldierPosition, position)
	})


	const surroundingPositions = allSurroundingPositions.filter((position) => {
		const isSoldierPosition = soldierPositions.some(soldierPosition => equalArrays(soldierPosition, position))
		const isStarPosition = starPositions.some(starPosition => equalArrays(starPosition, position))

		return (!isSoldierPosition && !isStarPosition)
	})

	const relativeSurroundingPositions = surroundingPositions.map((position) => {
		return subtractArrays(position, selectedSoldierPosition)
	})

	return relativeSurroundingPositions
}

const getSoldierPositions = (soldiers) => {
	return soldiers.map(soldier => soldier.gamePosition)
}

const getDirectionMap = (direction) => {
	switch (direction) {
		case '+x':
			return {
				face: '+x',
				left: '-z',
				right: '+z',
				up: '+y',
				down: '-y'
			}
		case '-x':
			return {
				face: '-x',
				left: '+z',
				right: '-z',
				up: '+y',
				down: '-y'
			}
		case '+y':
			return {
				face: '+y',
				left: '-x',
				right: '+x',
				up: '+z',
				down: '-z'
			}
		case '-y':
			return {
				face: '-y',
				left: '-x',
				right: '+x',
				up: '-z',
				down: '+z'
			}
		case '+z':
			return {
				face: '+z',
				left: '-x',
				right: '+x',
				up: '+y',
				down: '-y'
			}
		case '-z':
			return {
				face: '-z',
				left: '+x',
				right: '-x',
				up: '+y',
				down: '-y'
			}
		default:
			return {
				face: '+z',
				left: '-x',
				right: '+x',
				up: '+y',
				down: '-y'
			}
	}
}

function App() {

	const [loadGame, setLoadGame] = useState(true)
	const [soldiers, setSoldiers] = useState(INITIAL_SOLDIERS)
	const [starPositions, setStarPositions] = useState([])

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
	})

	const [directionMap, setDirectionMap] = useState({
        face: '-z',
        left: '-x',
        right: '+x',
        up: '+y',
        down: '-y'
    });

	/**
	 * When changing the Selected soldier, update the direction map to face the direction of the selected soldier
	 */
	useEffect(() => {
		if (selectedSoldier) {
			const soldierId = Number(selectedSoldier.name.split('-')[1])
			const selectedSoldierDirection = soldiers.find(soldier => soldier.id === soldierId).direction

			// Set directionMap
			setDirectionMap(getDirectionMap(selectedSoldierDirection))

		}
	}, [selectedSoldier, soldiers])

	useEffect(() => {
		if (loadGame && soldiers) {
			const soldierPositions = getSoldierPositions(soldiers)
			const starPositions = generateStarPositions(soldierPositions)

			setStarPositions(starPositions)
			setLoadGame(false)
		}
	}, [loadGame, soldiers])

	/**
	 * Update the allowedPositions when a Soldier is selected
	 */
	useEffect(() => {

		if (soldiers && selectedSoldier) {
			const selectedSoldierId = Number(selectedSoldier.name.split('-')[1])
			const selectedSoldierPosition = soldiers.find(soldier => soldier.id === selectedSoldierId).gamePosition
			const soldierPositions = getSoldierPositions(soldiers)

			const allowedPositions = getAllowedPositions(selectedSoldierPosition, starPositions, soldierPositions)
			setAllowedPositions(allowedPositions)
		} else {
			setAllowedPositions([])
		}
	}, [selectedSoldier, soldiers, starPositions])

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

				// Extract the Soldier Id from the selectedSoldier name
				const soldierId = Number(selectedSoldier.name.split('-')[1])

				const updatedSoldiers = soldiers.map(soldier => {
					if (soldier.id === soldierId) {
						return {
							...soldier,
							gamePosition: addArrays(currentSelectedPose.position, soldier.gamePosition),
							direction: currentSelectedPose.direction
						}
					} else {
						return soldier
					}
				})

				setSoldiers(updatedSoldiers)
			}

			setSelectedSoldier(null)
			setCurrentHoveredPose(null)
			setCurrentSelectedPose(null)
		}
	}, [movingModeDeactivate, selectedSoldier, currentSelectedPose, soldiers])

	/**
	 * Once moving Mode activate comes to an end, activate movingModeDeactivate
	 */
	useEffect(() => {
		if (!movingModeActivate) {
			setMovingModeDeactivate(true)
		}
	}, [movingModeActivate])

	/**
	 * Set movingModeDeactivate to false when all conditions are met
	 */
	useEffect(() => {
		if (!selectedSoldier && !currentSelectedPose && movingModeDeactivate) {
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


	

	const [currentHoveredPosition, setCurrentHoveredPosition] = useState(null)
	useEffect(() => {
		if (soldiers && currentHoveredPose && selectedSoldier) {
			const soldierId = Number(selectedSoldier.name.split('-')[1])

			// Find soldier with the same id
			const soldier = soldiers.find(soldier => soldier.id === soldierId)

			// Get the soldier's current position
			const currentHoveredPosition = addArrays(soldier.gamePosition, currentHoveredPose.position)

			setCurrentHoveredPosition(currentHoveredPosition)

		} else {
			setCurrentHoveredPosition(null)
		}
	}, [soldiers, currentHoveredPose, selectedSoldier])

	return (
		<SelectionPanelInteractionProvider>
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
						currentHoveredPosition={currentHoveredPosition}
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
						allowedPositions={allowedPositions}
						isPanelLocked={isPanelLocked}
					/>
				</div>
			</div>
		</SelectionPanelInteractionProvider>
  	)
}

export default App