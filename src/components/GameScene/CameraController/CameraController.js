import React, { useEffect, useRef } from 'react';
import {  useFrame } from 'react-three-fiber';
import { TrackballControls } from "@react-three/drei";
import { ARENA_LENGTH } from '../../../globals'
import { Vector3 } from 'three';
import { useCameraInteractionContext } from '../../../context/CameraInteractionContext';
import { getAddVector, getRotatedSoldierDirection } from './CameraController.utils';

const CameraController = () => {

    const controlsRef = useRef();

    let activateCameraChange = useRef({
        state: false,
        position: null,
        addVector: null
    })

    const {selectedSoldierObject} = useCameraInteractionContext()

    /**
     * This useEffect hook updates the camera position and direction when the selected soldier object changes.
     * If a soldier object is selected, it calculates the position and direction based on the soldier object.
     * If no soldier object is selected, it sets the position to the center of the arena and the direction to zoom out.
     */
    useEffect(() => {
        if (selectedSoldierObject) {
            const position = selectedSoldierObject.position
            const direction = getRotatedSoldierDirection(selectedSoldierObject)
            const zoomLevel = 5

            activateCameraChange.current = {
                state: true,
                position: position,
                addVector: getAddVector(direction, zoomLevel),
            }

        } else {
            const zoomLevel = ARENA_LENGTH
            activateCameraChange.current = {
                state: true,
                position: new Vector3(0,0,0),
                addVector: getAddVector(new Vector3(0,0,-1), zoomLevel),
            }
        }
    }, [selectedSoldierObject])

    useFrame(() => {
        // Check if a camera change has been activated
        if (activateCameraChange.current.state) {

            // Update the camera target to the new position
            controlsRef.current.target.set(
                activateCameraChange.current.position.x,
                activateCameraChange.current.position.y,
                activateCameraChange.current.position.z
            );

            // Update the camera's position based on the new target and the additional vector
            controlsRef.current.object.position.copy(controlsRef.current.target).add(activateCameraChange.current.addVector);

            // Set the zoom limits for the camera
            controlsRef.current.maxDistance = 190;
            controlsRef.current.minDistance = 1;

            // Reset the camera change activation state
            activateCameraChange.current.state = false;

            // Update the camera controls to apply the changes
            controlsRef.current.update();
        }
    });
    
    return (
        <TrackballControls 
            ref={controlsRef} 
            makeDefault 
            rotateSpeed="3" 
        />
    )
};

export default CameraController;
