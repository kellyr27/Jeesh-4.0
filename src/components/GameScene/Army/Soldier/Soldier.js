import React, {useEffect, useState, useRef, forwardRef} from 'react'
import { Vector3, QuadraticBezierCurve3, LineCurve3, Object3D} from 'three'
import getRelativeDirectionArray from '../../../../utils/getRelativeDirectionArray';
import { subtractArrays, addArrays, equalArrays } from '../../../../utils/arrayHelpers';
import { Cone } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector2, Raycaster } from 'three';

const getBezierCurve = (pose1, pose2) => {

    const { position: position1, direction: direction1 } = pose1
    const { position: position2, direction: direction2 } = pose2

    // Find the control point for the curve
    const controlPoint = subtractArrays(position2, getRelativeDirectionArray(direction2))

    if (equalArrays(controlPoint, position1)) {

        const curve = new LineCurve3(
            new Vector3(...position1),
            new Vector3(...position2)
        )

        return curve
    } else {
        const controlPoint = subtractArrays(position2, getRelativeDirectionArray(direction2))

        const curve = new QuadraticBezierCurve3(
            new Vector3(...position1),
            new Vector3(...controlPoint),
            new Vector3(...position2)
        )

        return curve
    }
}

const getRotationFromDirection = (direction) => {
    const directionMap = {
        '+x': [0, 0, Math.PI / 2],
        '-x': [0, 0, - Math.PI / 2],
        '+y': [- Math.PI / 2, 0, 0],
        '-y': [Math.PI / 2, 0, 0],
        '+z': [0, 0, 0],
        '-z': [0, 0, Math.PI],
    }

    if (directionMap.hasOwnProperty(direction)) {
        return offsetRotation(directionMap[direction])
    } else {
        console.error('Invalid direction inputted into getRotationFromDirection')
        return [0, 0, 0]
    }

}

//TODO: Optimize using DummyObject
function calculateLookAtRotation(target) {
    const dummyObject = new Object3D();
    dummyObject.lookAt(target);
    dummyObject.updateMatrixWorld();  // Ensure the world matrix is updated
    return dummyObject.rotation;
}

const offsetRotation = (rotation) => {
    return addArrays(rotation, [ -Math.PI / 2, 0, 0])
}

const Soldier = forwardRef(({position, rotation, setPosition, setRotation, name, color}, ref) => {

    const [bezierCurve, setBezierCurve] = useState(null)

    const testPoses = [
        {
            position: [0, 0, 0],
            direction: '+z'
        },
        {
            position: [1, 1, 1], 
            direction: '+z'
        },
        {
            position: [2, 2, 2], 
            direction: '+z'
        },
        {
            position: [3, 3, 3], 
            direction: '+z'
        },
    ]
    const [testPositionIndex, setTestPositionIndex] = useState(0)


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
    let animationPhase = useRef('Phase 1')
    let startTime = useRef(null)
    const PHASE_3_DURATION = 3
    const PHASE_2_DURATION = 6

    // useFrame((state, delta) => {
    //     const elapsedTime = state.clock.getElapsedTime()
    //     if (animationPhase.current === 'Phase 1') {

    //         // For testing
    //         setTestPositionIndex(testPositionIndex + 1)

    //         setBezierCurve(getBezierCurve(
    //             testPoses[testPositionIndex], 
    //             testPoses[testPositionIndex + 1]
    //         ))
    //         startTime.current = state.clock.getElapsedTime()
            
    //         animationPhase.current = 'Phase 2'
    //     } else if (animationPhase.current === 'Phase 2') {

    //         // if (testPositionIndex === testPoses.length - 1) {
    //         //     animationPhase.current = 'Phase 3';
    //         //     return
    //         // }
            

    //         const { direction } = testPoses[testPositionIndex - 1]

    //         const currentRotation = getRotationFromDirection(direction)
    //         const startRotation = calculateLookAtRotation(bezierCurve.getTangentAt(0))
    //         const startOffsetRotation = offsetRotation([startRotation.x, startRotation.y, startRotation.z])
            
    //         const t = (elapsedTime - startTime.current) / PHASE_2_DURATION

    //         if (t < 1) {
                
    //             const rotation = currentRotation.map((el, index) => {
    //                 return el + t * (startOffsetRotation[index] - el)
    //             })

    //             setRotation(rotation)
    //         } else {
    //             animationPhase.current = 'Phase 3'
    //         }

    //         // animationPhase.current = 'Phase 3'

    //     } else if (animationPhase.current === 'Phase 3') {
 
    //         const t = (elapsedTime - PHASE_2_DURATION - startTime.current) / PHASE_3_DURATION

    //         if (t < 1) {
    //             const point = bezierCurve.getPointAt(t)
    //             const tangent = bezierCurve.getTangentAt(t)
    //             const rotation = calculateLookAtRotation(tangent)
    //             setposition([point.x, point.y, point.z])
    //             setRotation(offsetRotation([rotation.x, rotation.y, rotation.z]))
    //         } else {
    //             animationPhase.current = 'Phase 4'
    //         }
    //     } else if (animationPhase.current === 'Phase 4') {

    //         const { direction } = testPoses[testPositionIndex]
    //         const currentRotation = getRotationFromDirection(direction)
    //         const startRotation = calculateLookAtRotation(bezierCurve.getTangentAt(0))
    //         const startOffsetRotation = offsetRotation([startRotation.x, startRotation.y, startRotation.z])

    //         const t = (elapsedTime - startTime.current) / PHASE_2_DURATION

    //         if (t < 1) {
                
    //             const rotation = startOffsetRotation.map((el, index) => {
    //                 return el + t * (currentRotation[index] - el)
    //             })

    //             setRotation(rotation)
    //         } else {
    //             animationPhase.current = 'Phase 5'
    //         }

    //     } else if (animationPhase.current === 'Phase 5') {
    //         // For testing
    //         if (testPositionIndex === testPoses.length - 1) {
    //             setTestPositionIndex(0)
    //         }

    //         // Correct small variations in position and rotation


    //         animationPhase.current = 'Phase 1'
    //     }

    // })

    return (

            <Cone 
                name={name}
                args={[0.4, 0.8]} 
                position={position} 
                rotation={rotation}
                material-color={color}      
            />
    )
})

export default Soldier