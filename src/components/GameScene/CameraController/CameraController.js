import React, { useEffect, useState, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { TrackballControls } from "@react-three/drei";
import { ARENA_LENGTH, ARENA_OFFSET } from '../../../globals'
import { Vector3 } from 'three';
import { useCameraInteractionContext } from '../../../context/CameraInteractionContext';
import {getLookAtRotation} from '../../../utils/displayHelpers'

const getAddVector = (direction, distance) => {
    return direction.clone().multiplyScalar(- distance);
}

const CameraController = () => {

    const controlsRef = useRef();

    let activateCameraChange = useRef({
        state: false,
        position: null
    })

    const {selectedSoldierObject} = useCameraInteractionContext()


    //TODO: To replace selectedSoldierPose
    useEffect(() => {
        if (selectedSoldierObject) {
            const position = selectedSoldierObject.position
            

            //TODO Rename direction, clean up code
            const direction = new Vector3()
            const dummyObject = selectedSoldierObject.clone();
            dummyObject.rotateOnAxis(new Vector3(1, 0, 0), Math.PI / 2)
            dummyObject.updateMatrixWorld()
            dummyObject.getWorldDirection(direction)


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
                addVector: getAddVector(new Vector3(0,0,- 1), zoomLevel),
            }
        }
    }, [selectedSoldierObject])

    useFrame(() => {
        if (activateCameraChange.current.state) {

            controlsRef.current.target.set(
                activateCameraChange.current.position.x,
                activateCameraChange.current.position.y,
                activateCameraChange.current.position.z
            );
            // controlsRef.current.object.position.set(20,20,20);

            // Set the initial distance
            controlsRef.current.object.position.copy(controlsRef.current.target).add(activateCameraChange.current.addVector);

            // Allow zooming
            controlsRef.current.maxDistance = 500;
            controlsRef.current.minDistance = 1;

            activateCameraChange.current.state = false;
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
