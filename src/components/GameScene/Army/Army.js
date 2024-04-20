import React, {useEffect, useState, createRef, forwardRef } from 'react';
import Soldier from './Soldier/Soldier';
import {getQuaternionFromLookAt} from '../../../utils/displayHelpers'
import { Vector3 } from 'three';
import {getRelativeDirectionArray} from '../../../utils/directionHelpers';
import {useCameraInteractionContext} from '../../../context/CameraInteractionContext'

const equalMeshes = (mesh1, mesh2) => {
    return mesh1.uuid === mesh2.uuid
}

const getSoldierId = (soldier) => {
    return parseInt(soldier.name.split('-')[1])
}

const Army = forwardRef(({
    soldierColors,
    onMoveCompletion,
    onSelectedSoldierChange,
    unselectSoldier,
    move,
    soldierPoses
}, ref) => {

    /**
     * move in an object with the following structure:
     * {
     *      soldierId: 2,
     *      move: {
     *          currentPose: {
*                   position: [x, y, z],
*                   direction: '+z'
     *          },
     *          targetPose: {
     *              position: [x, y, z],
     *              direction: '+z'
     *          }}
     * }
     */
    const [moveState, setMoveState] = useState(null)


    const soldierRefs = soldierPoses.map(() => createRef());

    const [hoveredSoldier, setHoveredSoldier] = useState(null)
    const [selectedSoldier, setSelectedSoldier] = useState(null)


    const {setSelectedSoldierObject} = useCameraInteractionContext()

    useEffect(() => {
        setSelectedSoldierObject(selectedSoldier)
    }, [selectedSoldier, setSelectedSoldierObject])

    /**
     * When move updates from null -> move, update the soldierPoses and Soldier colors
     */
    useEffect(() => {
        setMoveState(move)

        if (!move) {
            // At the end of a move, remove the selected and hovered soldiers
            setHoveredSoldier(null)
            setSelectedSoldier(null)
        }
    }, [move])

    useEffect(() => {
        // When right clicked (and the Soldier is not currently moving), reset the selected Soldier
        if (unselectSoldier && !moveState) {
            setSelectedSoldier(null)
        }
    
    }, [unselectSoldier, moveState])

    const { 
        soldierDefaultColor, 
        soldierHoveredColor, 
        soldierSelectedColor, 
        soldierBlockedColor 
    } = soldierColors


    /**
     * Set the color of the soldiers based on the state of the selected and hovered soldiers
     */
    useEffect(() => {
        const setColorOfSoldiers = () => {
            soldierRefs.forEach(ref => {
                // Check if the Soldier is selected 
                if (selectedSoldier && equalMeshes(ref.current, selectedSoldier)) {
                    ref.current.material.color.set(soldierSelectedColor);
                }
                // Check if (another) Soldier is moving.
                else if (moveState) {
                    ref.current.material.color.set(soldierBlockedColor)
                }
                // Check if the Soldier is hovered (and is not selected)
                else if (hoveredSoldier && equalMeshes(ref.current, hoveredSoldier)) {
                    ref.current.material.color.set(soldierHoveredColor);
                }
                else {
                    ref.current.material.color.set(soldierDefaultColor);
                }
            });
        }
        setColorOfSoldiers()
    }, [soldierDefaultColor, soldierHoveredColor, soldierSelectedColor, selectedSoldier, hoveredSoldier, soldierRefs, moveState, soldierBlockedColor])


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

    const eventHandlers = moveState ? {} : {
        onPointerOver: onPointerOverHandler,
        onPointerOut: onPointerOutHandler,
        onClick: onClickHandler,
    };

    return (
        <group
            {...eventHandlers}
        >
            {soldierPoses.map((soldier, index) => {
                
                const {direction} = soldier
                const relativeDirectionArray = getRelativeDirectionArray(direction)
                const quaternionRotation = getQuaternionFromLookAt(new Vector3(...relativeDirectionArray))
                const isMoving = moveState && moveState.soldierId === index

                return (
                    <Soldier
                        name={`soldier-${index}`}
                        key={index}
                        ref={soldierRefs[index]} 
                        initialPosition={soldier.gamePosition}
                        initialQuaternionRotation={quaternionRotation}
                        move={isMoving ? moveState.move : null}
                        onMoveCompletion={handleMoveCompletion}
                    />
                )

            })}
        </group>
    );
})

export default Army;