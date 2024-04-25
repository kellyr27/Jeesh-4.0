import React, {useRef, useState, useEffect, useCallback, Suspense} from 'react';
import { Canvas } from "react-three-fiber";
import Army from '../../components/GameScene/Army/Army';
import { useControls, folder } from 'leva';
import StarField from '../../components/GameScene/StarField/StarField';
import Arena from '../../components/GameScene/Arena/Arena';
import CameraController from '../../components/GameScene/CameraController/CameraController';
import AxesHelperController from '../../components/GameScene/AxesHelperController/AxesHelperController';
import {getCardinalDirectionMap, getPossibleMovePositions, generateStarPositions, generateInitialSoldier} from './GameScene.utils'
import { useSelectionPanelInteractionContext } from '../../context/SelectionPanelInteractionContext';
import { addArrays } from '../../utils/arrayHelpers';
import NightSky from '../../components/GameScene/NightSky/NightSky';

const INITIAL_SOLDIERS = generateInitialSoldier()

const GameScene = ({keyboardCycle, onKeyboardCompletion}) => {

    const [starPositions] = useState(generateStarPositions(INITIAL_SOLDIERS.map(soldier => soldier.gamePosition)))
    const [currentHoveredPosition, setCurrentHoveredPosition] = useState(null)
    const [unselectSoldier, setUnselectSoldier] = useState(false)
    const [moveState, setMoveState] = useState(null)

    // Used to keep the theoretical positions and directions of all soldiers
    const [soldierPoses, setSoldierPoses] = useState(INITIAL_SOLDIERS)

    const {
        setAllowedRelativeMovePositions,
        initialCardinalDirectionMap,
        setInitialCardinalDirectionMap,
        relativeHoveredPosition,
        setRelativeHoveredPosition,
        selectedSoldierId,
        setSelectedSoldierId,
        selectedSoldierPose,
        setSelectedSoldierPose,
        selectedRelativePose,
        setSelectedRelativePose,
        setLockSelectionPanel
    } = useSelectionPanelInteractionContext()

    /**
     * When a move has been selected on the Selected Panel and move is null set moveState from null -> move
     */
    useEffect(() => {

        if (selectedRelativePose && !moveState) {
            const move = {
                soldierId: selectedSoldierId,
                move: {
                    currentPose: selectedSoldierPose,
                    targetPose: {
                        gamePosition: addArrays(selectedSoldierPose.gamePosition, selectedRelativePose.position),
                        direction: selectedRelativePose.direction
                    }
                }
            }
            setMoveState(move)
        }
    }, [selectedRelativePose, selectedSoldierId, selectedSoldierPose, initialCardinalDirectionMap, moveState])


    const setNewSoldierPoses = useCallback((soldierId, targetPose) => {
        setSoldierPoses(prevSoldierPoses => {
            const newSoldierPoses = [...prevSoldierPoses];
            newSoldierPoses[soldierId] = targetPose;
            return newSoldierPoses;
        });
    }, []);

    /**
     * - When the move has changed states from null -> move, lock the Selection Panel 
     * and reset all the context variables. Update the SoldierPoses with the new position
     * 
     * - When the move has changed states from move -> null, unlock the Selection Panel
     */
    useEffect(() => {

        if (moveState) {

            const {soldierId, move: {targetPose}} = moveState
            setNewSoldierPoses(soldierId, targetPose)

            setLockSelectionPanel(true)
            setAllowedRelativeMovePositions(null)
            setSelectedSoldierId(null)
            setSelectedSoldierPose(null)
            setSelectedRelativePose(null)
            setRelativeHoveredPosition(null)

        } else {
            setLockSelectionPanel(false)
        }

    }, [
        moveState, 
        setLockSelectionPanel, 
        setAllowedRelativeMovePositions, 
        setSelectedSoldierId, 
        setSelectedSoldierPose,
        setSelectedRelativePose,
        setRelativeHoveredPosition,
        setNewSoldierPoses
    ])


    /**
     * When the mouse hovered over a position on the selection panel, update the currentHoveredPosition to display on the Arena
     */
    useEffect(() => {
        if (relativeHoveredPosition && selectedSoldierPose) {
            const hoveredPosition = addArrays(relativeHoveredPosition, selectedSoldierPose.gamePosition)
            setCurrentHoveredPosition(hoveredPosition)
        } else {
            setCurrentHoveredPosition(null)
        }
    }, [relativeHoveredPosition, selectedSoldierPose])


    const armyRef = useRef(null)

    const soldierColors = useControls('Soldiers', {
        'Colors': folder({
            soldierDefaultColor: '#00D2FF',
            soldierHoveredColor: '#FF00D2',
            soldierSelectedColor: 'green',
            soldierBlockedColor: '#FFD200'
        })
    })

    const updateSelectedSoldier = (soldierId) => {
        if (soldierId !== null) {
            setUnselectSoldier(false)

            const soldierPositions = soldierPoses.map(soldierPose => soldierPose.gamePosition)
            const currentSoldierPosition = soldierPositions[soldierId]
            const allowedRelativeMovePositions = getPossibleMovePositions(
                currentSoldierPosition, 
                starPositions, 
                soldierPositions
            )
            const cardinalDirectionMap = getCardinalDirectionMap(soldierPoses[soldierId].direction)
            
            // Set Context Variables
            setAllowedRelativeMovePositions(allowedRelativeMovePositions)
            setInitialCardinalDirectionMap(cardinalDirectionMap)
            setSelectedSoldierId(soldierId)
            setSelectedSoldierPose(soldierPoses[soldierId])
        } else {
            setUnselectSoldier(true)

            // Set Context Variables
            setAllowedRelativeMovePositions(null)
            // setInitialCardinalDirectionMap(null)
            setSelectedSoldierId(null)
            setSelectedSoldierPose(null)
        }
    }

    const onContextMenuHandler = (e) => {
        updateSelectedSoldier(null)
        e.stopPropagation()
    }

    const handleSelectedSoldierChange = (soldierId) => {
        updateSelectedSoldier(soldierId)
    }
    
    /**
     * This useEffect hook is responsible for cycling through soldiers when the left or right arrow key is pressed.
     * It runs whenever the keyboardCycle state changes.
     * If the left arrow key is pressed (keyboardCycle === 'left'), it selects the previous soldier or deselects the current soldier if it's the first one.
     * If the right arrow key is pressed (keyboardCycle === 'right'), it selects the next soldier or deselects the current soldier if it's the last one.
     * After updating the selected soldier, it calls the onKeyboardCompletion function to handle any additional logic after the keyboard event.
     */
    useEffect(() => {
        const numSoldiers = soldierPoses.length

        if (keyboardCycle === 'left') {
            if (selectedSoldierId === null) {
                updateSelectedSoldier(numSoldiers - 1)
            } else if (selectedSoldierId === 0) {
                updateSelectedSoldier(null)
            } else {
                updateSelectedSoldier(selectedSoldierId - 1)
            }

        } else if (keyboardCycle === 'right') {
            if (selectedSoldierId === null) {
                updateSelectedSoldier(0)
            } else if (selectedSoldierId === numSoldiers - 1) {
                updateSelectedSoldier(null)
            } else {
                updateSelectedSoldier(selectedSoldierId + 1)
            }
        }

        onKeyboardCompletion()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyboardCycle])

    const handleMoveCompletion = () => {
        setMoveState(null)
    }

    return (
        <Canvas 
            style={{ width: '100vw', height: '100vh' }}
            onContextMenu={onContextMenuHandler}
        >
            <color attach="background" args={["#191920"]} />
            {/* <StaryBackground
                numStars={100}
            /> */}
            <CameraController />
            <Arena
                soldierPoses={soldierPoses}
                currentHoveredPosition={currentHoveredPosition}
            />
            <Army 
                ref={armyRef}
                soldierColors={soldierColors}
                onMoveCompletion={handleMoveCompletion}
                onSelectedSoldierChange={handleSelectedSoldierChange}
                isLocked={false}
                unselectSoldier={unselectSoldier}
                move={moveState}
                soldierPoses={soldierPoses}
                buttonPressedSelectedSoldierId={selectedSoldierId}
            />
            <Suspense fallback={null}>
                <StarField starPositions={starPositions} />
            </Suspense>
            <AxesHelperController />
            <NightSky />
        </Canvas>
    )
}

export default GameScene;