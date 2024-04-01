import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector2, Raycaster } from 'three';
import Soldier from './Soldier/Soldier';
import { useControls, folder } from 'leva';

const equalMeshes = (mesh1, mesh2) => {
    return mesh1.uuid === mesh2.uuid
}

const Army = ({armyNum, hoveredSoldier, setHoveredSoldier, selectedSoldier, setSelectedSoldier, soldierDefaultColor, soldierHoveredColor, soldierSelectedColor, soldierBlockedColor}) => {
    const [soldier1Position, setSoldier1Position] = React.useState([0, 0, 0])
    const [soldier1Rotation, setSoldier1Rotation] = React.useState([0, 0, 0])

    const [soldier2Position, setSoldier2Position] = React.useState([1, 1, 1])
    const [soldier2Rotation, setSoldier2Rotation] = React.useState([0, 0, 0])

    const [soldier3Position, setSoldier3Position] = React.useState([2, 2, 2])
    const [soldier3Rotation, setSoldier3Rotation] = React.useState([0, 0, 0])

    // Update the Selected Soldiers color
    useEffect(() => {
        if (selectedSoldier) {
            selectedSoldier.material.color.set(soldierSelectedColor)
        }
    }, [selectedSoldier, soldierSelectedColor])

    const updateSelectedSoldierOnClick = (newSelectedSoldier) => {

        // First check if a Soldier has been selected
        if (newSelectedSoldier) {

            if (selectedSoldier) {
                if (!equalMeshes(newSelectedSoldier, selectedSoldier)) {
                    selectedSoldier.material.color.set(soldierDefaultColor)
                    setSelectedSoldier(newSelectedSoldier)
                }
                
            } else {
                setSelectedSoldier(newSelectedSoldier)
            }
        }
    }

    const onPointerOverHandler = (e) => {
		const soldier = e.intersections[0].object;

        if (soldier) {
            setHoveredSoldier(soldier)
            if (!selectedSoldier || (selectedSoldier && !equalMeshes(soldier, selectedSoldier))) {
                soldier.material.color.set(soldierHoveredColor)
            }
        }

		e.stopPropagation();
	};

	const onPointerOutHandler = (e) => {
		if (hoveredSoldier) {
            if (selectedSoldier && equalMeshes(hoveredSoldier, selectedSoldier)) {
                // Do nothing, the selected soldier should remain the selected color
            } else {
                hoveredSoldier.material.color.set(soldierDefaultColor)
            }
        } else {
            hoveredSoldier.material.color.set(soldierDefaultColor)
        }

        setHoveredSoldier(null)
		e.stopPropagation();
	};

    const onClickHandler = (e) => {
        const soldier = e.intersections[0].object;

        updateSelectedSoldierOnClick(soldier)

    }

    


    return (
        <group
            onPointerOver={onPointerOverHandler}
            onPointerOut={onPointerOutHandler}
            onClick={onClickHandler}
        >
            <Soldier name={`Soldier_${armyNum}_1`} index={0} position={[0, 0, 0]} rotation={[0, 0, 0]} color={soldierDefaultColor} />
            <Soldier name={`Soldier_${armyNum}_2`} index={1} position={[1, 1, 1]} rotation={[0, 0, 0]} color={soldierDefaultColor} />
            <Soldier name={`Soldier_${armyNum}_3`} index={2} position={[2, 2, 2]} rotation={[0, 0, 0]} color={soldierDefaultColor} />
        </group>
    );
};

export default Army;