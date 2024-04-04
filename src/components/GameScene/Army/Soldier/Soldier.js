import React, {useEffect, useState, useRef } from 'react'
import { Vector3, QuadraticBezierCurve3, LineCurve3, Object3D} from 'three'
import { subtractArrays, addArrays, equalArrays } from '../../../../utils/arrayHelpers';
import { Cone } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import {getRotationFromDirection, getRelativeDirectionArray} from '../../../../utils/directionHelpers'
import { getMovePath } from '../../../../utils/displayHelpers';
import * as THREE from 'three';


// Used for the Bezier Curve
import { Line, BufferGeometry, LineBasicMaterial } from 'three';

function calculateShortestRotation(lookAtA, lookAtB) {
    // Create the quaternion representing the rotation from lookAtA to lookAtB
    const quaternion = new THREE.Quaternion().setFromUnitVectors(lookAtA, lookAtB);

    return quaternion;
}

function calculateLookAtRotation2(target) {

    const dummyObject = new Object3D();
    dummyObject.lookAt(target);
    console.log(target)
    dummyObject.rotateOnAxis(new Vector3(1, 0, 0), - Math.PI / 2)
    dummyObject.updateMatrixWorld();  // Ensure the world matrix is updated
    // console.log(target, [dummyObject.rotation.x, dummyObject.rotation.y, dummyObject.rotation.z])
    return [dummyObject.rotation.x, dummyObject.rotation.y, dummyObject.rotation.z]
}

const Soldier = ({position, rotation, setPosition, setRotation, name, color, movingMode, setMovingMode, currentSelectedPose, setCurrentSelectedPose, setSelectedSoldier}, ref) => {

    const [bezierCurve, setBezierCurve] = useState(null)

    /**
     * For animation of the Soldier, we use different Phases
     * 
     * Phase 1 - Pre-movement. Set all the variables needed for the movement.
     * Phase 2 - Rotate Soldier to the face the inital rotation of the curve.
     *           If already facing the right direction, skip this phase
     * Phase 3 - Move the Soldier along the curve
     * Phase 4 - Rotation correction
     * Phase 5 - Reset all the variables.
     * 
     */
    let animationPhase = useRef(1)
    let startTime = useRef(null)
    let startPosition = useRef(null)
    let startRotation = useRef(null)
    const PHASE_2_DURATION = 1
    const PHASE_3_DURATION = 2
    const PHASE_4_DURATION = 1


    // Testing Quarternions
    const soldierRef = useRef();
    const startQuaternion = useRef(new THREE.Quaternion());
    const endQuaternion = useRef(null);


    useFrame((state, delta) => {
        const elapsedTime = state.clock.getElapsedTime()

        if (movingMode && animationPhase.current === 1) {


            setBezierCurve(getMovePath(
                {
                    position: position,
                    direction: 'TODO: Remove'
                }, 
                {
                    position: addArrays(currentSelectedPose.position, position),
                    direction: currentSelectedPose.direction
                }
            ))
            startTime.current = state.clock.getElapsedTime()

            startPosition.current = position
            startRotation.current = rotation

            animationPhase.current = 'Phase 2'
        } 
        else if (animationPhase.current === 'Phase 2') {

            const phase2Rotation = calculateLookAtRotation2(bezierCurve.getTangentAt(0))

            // const lookAtA = a
            let lookAtB = bezierCurve.getTangentAt(0)

            endQuaternion.current = calculateShortestRotation(new THREE.Vector3(0, -1, 0), lookAtB)

            const t = (elapsedTime - startTime.current) / PHASE_2_DURATION

            if (t < 1) {

                // THREE.Quaternion.slerp(startQuaternion.current, endQuaternion.current, soldierRef.current.quaternion, t);
                soldierRef.current.quaternion.copy(startQuaternion.current).slerp(endQuaternion.current, t);

                // const newRotation = startRotation.current.map((el, index) => {
                //     return el + t * (phase2Rotation[index] - el)
                // })
                // // console.log('New Rotation is', newRotation)
                // setRotation(newRotation)
            } else {
                animationPhase.current = 'Phase 3'
            }

        } 
        else if (animationPhase.current === 'Phase 3') {
 
            const t = (elapsedTime - PHASE_2_DURATION - startTime.current) / PHASE_3_DURATION

            if (t < 1) {
                const point = bezierCurve.getPointAt(t)
                const tangent = bezierCurve.getTangentAt(t)
                const blahRotation = calculateLookAtRotation2(tangent)
                setPosition([point.x, point.y, point.z])
                setRotation(blahRotation)
            } else {
                animationPhase.current = 'Phase 4'
            }
        } 
        else if (animationPhase.current === 'Phase 4') {
            // Phase 4 may be unneccessary
            const { direction } = currentSelectedPose

            const currentRotation = getRotationFromDirection(direction)
            const phase4Rotation = calculateLookAtRotation2(bezierCurve.getTangentAt(1))

            const t = (elapsedTime - PHASE_3_DURATION - PHASE_2_DURATION - startTime.current) / PHASE_4_DURATION

            if (t < 1) {
                
                const newRotation = phase4Rotation.map((el, index) => {
                    return el + t * (currentRotation[index] - el)
                })

                // console.log(currentRotation, phase4Rotation, newRotation)

                setRotation(newRotation)
            } else {
                animationPhase.current = 'Phase 5'
            }
        }
        else if (animationPhase.current === 'Phase 5') {
            setMovingMode(false)
            

            animationPhase.current = 'Phase 6'
        }
        else if (!movingMode && animationPhase.current === 'Phase 6') {
            setCurrentSelectedPose(null)
            setSelectedSoldier(null)
            animationPhase.current = 'Phase 1'
        }

    })

    return (

            <Cone 
                ref={soldierRef}
                name={name}
                args={[0.4, 0.8]} 
                position={position} 
                rotation={rotation}
                material-color={color}      
            />
    )
}

export default Soldier