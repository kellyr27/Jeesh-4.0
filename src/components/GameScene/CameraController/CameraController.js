import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { TrackballControls } from "@react-three/drei";

const CameraController = ({ selectedSoldier }) => {
    const controlsRef = useRef();
    const { camera } = useThree();
    const zoomLevel = useRef(camera.zoom)
    const timeoutId = useRef()

    const ZOOM_AFTER_MOVE_TIME = 2000

    useEffect(() => {
        if (controlsRef.current) {
            if (selectedSoldier) {
                clearTimeout(timeoutId.current)
                console.log('here')
                zoomLevel.current = 40;
            } else {
                timeoutId.current = setTimeout(() => {
                    zoomLevel.current = 20;
                    controlsRef.current.target.set(0, 0, 0);
                }, ZOOM_AFTER_MOVE_TIME)
            }
        }
    }, [selectedSoldier, controlsRef, camera]);

    useFrame(() => {
        if (selectedSoldier) {
            const position = selectedSoldier.position;
            controlsRef.current.target.set(position.x, position.y, position.z);
        } 
        
        // Set the camera zoom and update the projection matrix
        camera.zoom = zoomLevel.current;
        camera.updateProjectionMatrix();

        // Update the controls
        controlsRef.current.update();
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
