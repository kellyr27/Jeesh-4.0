import React, {useState} from 'react';
import { Canvas } from "@react-three/fiber";
import { Stars, TrackballControls } from "@react-three/drei";
import Army from '../components/GameScene/Army/Army';
import Arena from '../components/GameScene/Arena/Arena';
import { useControls, folder } from 'leva';
import {INITIAL_SOLDIERS} from '../globals';
import StarField from '../components/GameScene/StarField/StarField';
import { Star } from 'react-konva';
import Arena2 from '../components/GameScene/Arena/Arena2';

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
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={1}
            />
            <TrackballControls makeDefault rotateSpeed="3" />
            {/* <Arena 
                soldier1Position={soldier1Position}
                setSoldier1Position={setSoldier1Position}
                soldier1Direction={soldier1Direction}
                setSoldier1Direction={setSoldier1Direction}
                movingModeDeactivate={movingModeDeactivate}
                soldiers={soldiers}
                currentHoveredPose={currentHoveredPose}
                currentHoveredPosition={currentHoveredPosition}
            /> */}
            <Arena2
                soldiers={soldiers}
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
            <StarField starPositions={starPositions.current} />
            <axesHelper args={[5]} />
        </Canvas>
    )
}

export default GameScene;