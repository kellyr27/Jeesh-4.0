import React, {useEffect, useState, createRef, useRef, forwardRef, useImperativeHandle } from 'react';
import Soldier2 from './Soldier/Soldier2';
import {getQuaternionFromLookAt} from '../../../utils/displayHelpers'
import { Vector3 } from 'three';
import {getRelativeDirectionArray} from '../../../utils/directionHelpers';

const equalMeshes = (mesh1, mesh2) => {
    return mesh1.uuid === mesh2.uuid
}

const getSoldierId = (soldier) => {
    return soldier.name.split('-')[1]
}

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

const Army = forwardRef(({
    soldierColors,
    onMoveCompletion,
    onSelectedSoldierChange,
    isLocked,
    unselectSoldier
}, ref) => {

    // Used to keep the theoretical positions and directions of all
    const soldierPoses = useRef(INITIAL_SOLDIERS)

    const soldierRefs = soldierPoses.current.map(() => createRef());

    const [hoveredSoldier, setHoveredSoldier] = useState(null)
    const [selectedSoldier, setSelectedSoldier] = useState(null)

    useEffect(() => {
        if (unselectSoldier) {
            setSelectedSoldier(null)
        }
    
    }, [unselectSoldier])

    const { 
        soldierDefaultColor, 
        soldierHoveredColor, 
        soldierSelectedColor, 
        soldierBlockedColor 
    } = soldierColors


    // Expose the getCurrentSoldierPositions method to the parent component
    useImperativeHandle(ref, () => ({
        getSoldierPoses: () => {
            return soldierPoses.current
        },
    }))

    /**
     * Update the Soldier Colors // TODO
     */
    // const updateSoldierColors = () => {
        
    // }

    /**
     * Set the color of the soldiers based on the state of the selected and hovered soldiers
     */
    useEffect(() => {

        soldierRefs.forEach(ref => {
            // Check if the Soldier is selected 
            if (selectedSoldier && equalMeshes(ref.current, selectedSoldier)) {
                ref.current.material.color.set(soldierSelectedColor);
            }
            // Check if the Soldier is hovered (and is not selected)
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

        // Propagate up when selected soldier changes to update the Selection Panel
        const soldierId = getSoldierId(soldier)
        onSelectedSoldierChange(soldierId)
        e.stopPropagation();
    };


    const handleMoveCompletion = () => {
        onMoveCompletion()
    }

    const eventHandlers = isLocked ? {} : {
      onPointerOver: onPointerOverHandler,
      onPointerOut: onPointerOutHandler,
      onClick: onClickHandler,
    };

    return (
        <group
            {...eventHandlers}
        >
            {soldierPoses.current.map((soldier, index) => {
                
                const {direction} = soldier
                const relativeDirectionArray = getRelativeDirectionArray(direction)
                const quaternionRotation = getQuaternionFromLookAt(new Vector3(...relativeDirectionArray))


                return (
                    <Soldier2 
                        name={`soldier-${index}`}
                        key={index}
                        ref={soldierRefs[index]} 
                        initialPosition={soldier.gamePosition}
                        initialQuaternionRotation={quaternionRotation}
                        move={null}
                        onMoveCompletion={handleMoveCompletion}
                    />
                )

            })}
        </group>
    );
})

export default Army;