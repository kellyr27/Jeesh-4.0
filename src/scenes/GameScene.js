import React, {useRef, useState, useContext, useEffect} from 'react';
import { Canvas } from "@react-three/fiber";
import { Stars} from "@react-three/drei";
import Army from '../components/GameScene/Army/Army2';
import { useControls, folder } from 'leva';
import StarField from '../components/GameScene/StarField/StarField';
import Arena from '../components/GameScene/Arena/Arena';
import CameraController from '../components/GameScene/CameraController/CameraController';
import AxesHelperController from '../components/GameScene/AxesHelperController/AxesHelperController';
import {getCardinalDirectionMap, getPossibleMovePositions} from './GameScene.utils'
import { useSelectionPanelInteractionContext } from '../context/SelectionPanelInteractionContext';
import { addArrays } from '../utils/arrayHelpers';

const GameScene = ({
    selectedSoldier, 
    setSelectedSoldier,
    soldiers, 
    onSelectedSoldierChange
}) => {

    const [starPositions, setStarPositions] = useState([])
    const [currentHoveredPosition, setCurrentHoveredPosition] = useState(null)
    const [unselectSoldier, setUnselectSoldier] = useState(false)

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
        setSelectedSoldierPose
    } = useSelectionPanelInteractionContext()

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

        const soldierPoses = armyRef.current.getSoldierPoses()
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
                soldiers={soldiers}
                currentHoveredPosition={currentHoveredPosition}
            />
            <Army 
                ref={armyRef}
                soldierColors={soldierColors}
                onMoveCompletion={()=> console.log('Move Completed')}
                onSelectedSoldierChange={handleSelectedSoldierChange}
                isLocked={false}
                unselectSoldier={unselectSoldier}
            />
            <StarField starPositions={starPositions} />
            <AxesHelperController />
        </Canvas>
    )
}

export default GameScene;