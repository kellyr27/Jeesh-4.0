import React, { useRef, useEffect, createRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector2, Raycaster } from 'three';
import Soldier2 from './Soldier/Soldier2';
import { useControls, folder } from 'leva';

const equalMeshes = (mesh1, mesh2) => {
    return mesh1.uuid === mesh2.uuid
}

const Army = ({
    armyNum, 
    hoveredSoldier, 
    setHoveredSoldier, 
    selectedSoldier, 
    setSelectedSoldier, 
    currentSelectedPose, 
    setCurrentSelectedPose,
    soldier1Position,
    setSoldier1Position, 
    soldiers,
    soldierColors,
    phaseTimes,
    movingModeActivate,
    setMovingModeActivate,
    movingModeDeactivate,
    setMovingModeDeactivate
}) => {

    const { soldierDefaultColor, soldierHoveredColor, soldierSelectedColor, soldierBlockedColor } = soldierColors

    const soldierRefs = soldiers.map(() => createRef());
    useEffect(() => {

        soldierRefs.forEach(ref => {

            // Check if the Soldier is selected 
            if (selectedSoldier && equalMeshes(ref.current, selectedSoldier)) {
                ref.current.material.color.set(soldierSelectedColor);
            }
            // Check if the Soldier is hovered
            else if (hoveredSoldier && equalMeshes(ref.current, hoveredSoldier)) {
                ref.current.material.color.set(soldierHoveredColor);
            }
            else {
                ref.current.material.color.set(soldierDefaultColor);
            }

          });

    }, [soldierDefaultColor, soldierHoveredColor, soldierSelectedColor, selectedSoldier, hoveredSoldier, soldierRefs])

    const onPointerOverHandler = (e) => {
        const soldier = e.intersections[0].object;

        setHoveredSoldier(soldier)
        e.stopPropagation();
    };

    /**
     * When the cursor exits the soldier, the soldier's color is reset to the default color
     */
    const onPointerOutHandler = (e) => {
        setHoveredSoldier(null);
        e.stopPropagation();
    };

    const onClickHandler = (e) => {
        const soldier = e.intersections[0].object;

        setSelectedSoldier(soldier)
        e.stopPropagation();
    };

    


    return (
        <group
            onPointerOver={onPointerOverHandler}
            onPointerOut={onPointerOutHandler}
            onClick={onClickHandler}
        >
            {soldiers.map((soldier, index) => {
 
                return (
                    <Soldier2 
                        ref={soldierRefs[index]}
                        key={index}
                        color={soldierDefaultColor}
                        soldier={soldier}
                        phaseTimes={phaseTimes}
                        currentSelectedPose={currentSelectedPose}
                        selectedSoldier={selectedSoldier}
                        movingModeActivate={movingModeActivate}
                        setMovingModeActivate={setMovingModeActivate}
                        movingModeDeactivate={movingModeDeactivate}
                        setMovingModeDeactivate={setMovingModeDeactivate}
                    />
                )

            })}
        </group>
    );
};

export default Army;