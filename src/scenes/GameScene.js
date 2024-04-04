import React from 'react';
import { Canvas } from "@react-three/fiber";
import { Stars, TrackballControls } from "@react-three/drei";
import Army from '../components/GameScene/Army/Army';
import Arena from '../components/GameScene/Arena/Arena';
import { useControls, folder } from 'leva';

//TODO: Merge into utils
const equalMeshes = (mesh1, mesh2) => {
    return mesh1.uuid === mesh2.uuid
}

const GameScene = ({hoveredSoldier, setHoveredSoldier, selectedSoldier, setSelectedSoldier, movingMode, setMovingMode, currentSelectedPose, setCurrentSelectedPose }) => {

    const [soldier1Position, setSoldier1Position] = React.useState([0, 0, 0])
    const [soldier1Direction, setSoldier1Direction] = React.useState('-z')

    const { soldierDefaultColor, soldierHoveredColor, soldierSelectedColor, soldierBlockedColor } = useControls('Soldiers', {
        'Colors': folder({
            soldierDefaultColor: '#00D2FF',
            soldierHoveredColor: '#FF00D2',
            soldierSelectedColor: 'green',
            soldierBlockedColor: '#FFD200'
        })
    })

    const onContextMenuHandler = (e) => {
        // const soldier = e.intersections[0].object;
        console.log(e)

        // if (soldier && selectedSoldier) {
        //     // Scenario if deselecting a Soldier with a Selected Soldier
        //     console.log('1')
        //     if (equalMeshes(soldier, selectedSoldier)) {
        //         // Scenario if deselecting a Soldier when the mouse is hovering over it
        //         soldier.material.color.set(soldierHoveredColor)
        //     } else {
        //         // Scenario if deselecting a Soldier when the mouse is hovering over another Soldier
        //         soldier.material.color.set(soldierDefaultColor)
        //     }
        // } else {
        //     // Scenario if deselecting a Soldier when the mouse is not hovering over any Soldier
        //     console.log('2')
        //     if (selectedSoldier) {
        //         // Scenario if deselecting a Soldier when a Soldier is already selected and the mouse is not hovering over any Soldier
        //         selectedSoldier.material.color.set(soldierDefaultColor)
        //     }
        // }

        // setSelectedSoldier(null)
        // e.stopPropagation()
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
            <Arena 
                soldier1Position={soldier1Position}
                setSoldier1Position={setSoldier1Position}
                soldier1Direction={soldier1Direction}
                setSoldier1Direction={setSoldier1Direction}
                movingMode={movingMode}
            />
            <Army 
                armyNum={1}
                hoveredSoldier={hoveredSoldier}
                setHoveredSoldier={setHoveredSoldier}
                selectedSoldier={selectedSoldier}
                setSelectedSoldier={setSelectedSoldier}
                soldierDefaultColor={soldierDefaultColor}
                soldierHoveredColor={soldierHoveredColor}
                soldierSelectedColor={soldierSelectedColor}
                soldierBlockedColor={soldierBlockedColor}
                movingMode={movingMode}
                setMovingMode={setMovingMode}
                currentSelectedPose={currentSelectedPose}
                setCurrentSelectedPose={setCurrentSelectedPose}
                soldier1Position={soldier1Position}
                setSoldier1Position={setSoldier1Position}
            />
            <axesHelper args={[5]} />
        </Canvas>
    )
}

export default GameScene;