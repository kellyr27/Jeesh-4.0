import React, {useEffect, createRef } from 'react';
import Soldier2 from './Soldier/Soldier2';
import {getRelativeDirectionArray, getQuaternionFromLookAt} from '../../../utils/displayHelpers'
import { Vector3 } from 'three';


const equalMeshes = (mesh1, mesh2) => {
    return mesh1.uuid === mesh2.uuid
}

const Army = ({
    hoveredSoldier, 
    setHoveredSoldier, 
    selectedSoldier, 
    setSelectedSoldier, 
    soldiers,
    soldierColors,
    onMoveCompletion,
    onSelectedSoldierChange,
    isLocked
}) => {

    const soldierRefs = soldiers.map(() => createRef());

    const [hoveredSoldier, setHoveredSoldier] = useState(null)
    const [selectedSoldier, setSelectedSoldier] = useState(null)

    const { 
        soldierDefaultColor, 
        soldierHoveredColor, 
        soldierSelectedColor, 
        soldierBlockedColor 
    } = soldierColors

    /**
     * Update the Soldier Colors // TODO
     */
    const updateSoldierColors = () => {
        
    }

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
        e.stopPropagation();
    };


    const handleMoveCompletion = () => {
        onMoveCompletion()
    }

    /**
     * When the component is mounted, set the color of the soldiers to the default color
     */
    useEffect(() => {
        soldierRefs.forEach(ref => {
            ref.current.material.color.set(soldierDefaultColor);
        })
    }, [])


    return (
        <group
            // TODO: Set these off when isLocked
            onPointerOver={onPointerOverHandler}
            onPointerOut={onPointerOutHandler}
            onClick={onClickHandler}
        >
            {soldiers.map((soldier, index) => {
                
                const {direction} = soldier
                const relativeDirectionArray = getRelativeDirectionArray(direction)
                const quaternionRotation = getQuaternionFromLookAt(new Vector3(...relativeDirectionArray))


                return (
                    <Soldier2 
                        key={index}
                        initialPosition={soldier.gamePosition}
                        initialQuaternionRotation={quaternionRotation}
                        move={null}
                        onMoveCompletion={handleMoveCompletion}
                    />
                )

            })}
        </group>
    );
};

export default Army;