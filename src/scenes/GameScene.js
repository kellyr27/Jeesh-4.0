import React, {useRef, useState, useContext, useEffect, useCallback} from 'react';
import { Canvas } from "@react-three/fiber";
import { Stars} from "@react-three/drei";
import Army from '../components/GameScene/Army/Army2';
import { useControls, folder } from 'leva';
import StarField from '../components/GameScene/StarField/StarField';
import Arena from '../components/GameScene/Arena/Arena';
import CameraController from '../components/GameScene/CameraController/CameraController';
import AxesHelperController from '../components/GameScene/AxesHelperController/AxesHelperController';
import {getCardinalDirectionMap, getPossibleMovePositions, generateStarPositions} from './GameScene.utils'
import { useSelectionPanelInteractionContext } from '../context/SelectionPanelInteractionContext';
import { addArrays } from '../utils/arrayHelpers';

const INITIAL_SOLDIERS = [
    {
        gamePosition: [5, 5, 4],
        direction: '+z',
    },
    {
        gamePosition: [4, 4, 9],
        direction: '-z',
    },
    {
        gamePosition: [2, 2, 2],
        direction: '+x',
    }
]

const GameScene = ({
    selectedSoldier, 
    setSelectedSoldier,
    soldiers, 
    onSelectedSoldierChange
}) => {

    const [starPositions, setStarPositions] = useState(generateStarPositions(INITIAL_SOLDIERS))
    const [currentHoveredPosition, setCurrentHoveredPosition] = useState(null)
    const [unselectSoldier, setUnselectSoldier] = useState(false)
    const [moveState, setMoveState] = useState(null)

    // Used to keep the theoretical positions and directions of all
    const [soldierPoses, setSoldierPoses] = useState(INITIAL_SOLDIERS)

    const {
        allowedRelativeMovePositions,
        setAllowedRelativeMovePositions,
        initialCardinalDirectionMap,
        setInitialCardinalDirectionMap,
        relativeHoveredPosition,
        setRelativeHoveredPosition,
        selectedSoldierId,
        setSelectedSoldierId,
        selectedSoldierPose,
        setSelectedSoldierPose,
        selectedRelativePosition,
        setSelectedRelativePosition,
        lockSelectionPanel,
        setLockSelectionPanel
    } = useSelectionPanelInteractionContext()

    /**
     * When a move has been selected on the Selected Panel and move is null set moveState from null -> move
     */
    useEffect(() => {
        if (selectedRelativePosition && !moveState) {
            const move = {
                soldierId: selectedSoldierId,
                move: {
                    currentPose: selectedSoldierPose,
                    targetPose: {
                        gamePosition: addArrays(selectedSoldierPose.gamePosition, selectedRelativePosition),
                        direction: initialCardinalDirectionMap.face
                    }
                }
            }
            setMoveState(move)
        }
    }, [selectedRelativePosition, selectedSoldierId, selectedSoldierPose, initialCardinalDirectionMap, moveState])


    const setNewSoldierPoses = useCallback((soldierId, targetPose) => {
        const newSoldierPoses = [...soldierPoses]
        newSoldierPoses[soldierId] = targetPose
        setSoldierPoses(newSoldierPoses)
    }, [soldierPoses]);

    /**
     * - When the move has changed states from null -> move, lock the Selection Panel 
     * and reset all the context variables. Update the SoldierPoses with the new position
     * 
     * - When the move has changed states from move -> null, unlock the Selection Panel
     */
    useEffect(() => {

        if (moveState) {

            const {soldierId, move: {currentPose, targetPose}} = moveState
            setNewSoldierPoses(soldierId, targetPose)

            setLockSelectionPanel(true)
            setAllowedRelativeMovePositions(null)
            setSelectedSoldierId(null)
            setSelectedSoldierPose(null)
            setSelectedRelativePosition(null)
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
        setSelectedRelativePosition,
        setRelativeHoveredPosition,
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

    const phaseTimes = useControls('Soldiers', {
        'Movement Times': folder({
            phase2Duration: 1,
            phase3Duration: 2,
            phase4Duration: 1
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

    //TODO: What if NULL
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
            <Stars
                radius={50}
                depth={50}
                count={50000}
                factor={4}
                saturation={0}
                fade
                speed={1}
            />
            <CameraController 
                selectedSoldier={selectedSoldier}
            />
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
            <StarField starPositions={starPositions} />
            <AxesHelperController />
        </Canvas>
    )
}

export default GameScene;