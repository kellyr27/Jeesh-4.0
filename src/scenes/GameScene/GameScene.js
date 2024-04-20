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

const GameScene = () => {

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

    const onContextMenuHandler = (e) => {
        setUnselectSoldier(true)

        // Set Context Variables
        setAllowedRelativeMovePositions(null)
        // setInitialCardinalDirectionMap(null)
        setSelectedSoldierId(null)
        setSelectedSoldierPose(null)

        e.stopPropagation()
    }

    const handleSelectedSoldierChange = (soldierId) => {
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
    }

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