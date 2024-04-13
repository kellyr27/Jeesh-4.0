import React, {useState, useRef, useEffect} from 'react';
import { Canvas, useThree } from "@react-three/fiber";
import { Stars, TrackballControls } from "@react-three/drei";
import Army from '../components/GameScene/Army/Army';
import { useControls, folder } from 'leva';
import {INITIAL_SOLDIERS} from '../globals';
import StarField from '../components/GameScene/StarField/StarField';
import { Star } from 'react-konva';
import Arena from '../components/GameScene/Arena/Arena';
import CameraController from '../components/GameScene/CameraController/CameraController';
import AxesHelperController from '../components/GameScene/AxesHelperController/AxesHelperController';

const GameScene = ({
    hoveredSoldier, 
    setHoveredSoldier, 
    selectedSoldier, 
    setSelectedSoldier,
    currentSelectedPose, 
    setCurrentSelectedPose, 
    soldiers, 
    setSoldiers,
    movingModeActivate,
    setMovingModeActivate,
    movingModeDeactivate,
    setMovingModeDeactivate,
    starPositions,
    currentHoveredPose,
    currentHoveredPosition
}) => {

    //TODO: Remove this
    const [soldier1Position, setSoldier1Position] = React.useState([0, 0, 0])
    const [soldier1Direction, setSoldier1Direction] = React.useState('-z')

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
        setSelectedSoldier(null)
        e.stopPropagation()
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
                armyNum={1}
                hoveredSoldier={hoveredSoldier}
                setHoveredSoldier={setHoveredSoldier}
                selectedSoldier={selectedSoldier}
                setSelectedSoldier={setSelectedSoldier}
                currentSelectedPose={currentSelectedPose}
                setCurrentSelectedPose={setCurrentSelectedPose}
                soldier1Position={soldier1Position}
                setSoldier1Position={setSoldier1Position}
                soldiers={soldiers}
                soldierColors={soldierColors}
                phaseTimes={phaseTimes}
                movingModeActivate={movingModeActivate}
                setMovingModeActivate={setMovingModeActivate}
                movingModeDeactivate={movingModeDeactivate}
                setMovingModeDeactivate={setMovingModeDeactivate}
            />
            <StarField starPositions={starPositions} />
            <AxesHelperController />
        </Canvas>
    )
}

export default GameScene;