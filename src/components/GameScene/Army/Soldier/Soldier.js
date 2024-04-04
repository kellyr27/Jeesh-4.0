import React, {useEffect, useState, useRef, forwardRef} from 'react'
import { Vector3, QuadraticBezierCurve3, LineCurve3, Object3D} from 'three'
import getRelativeDirectionArray from '../../../../utils/getRelativeDirectionArray';
import { subtractArrays, addArrays, equalArrays } from '../../../../utils/arrayHelpers';
import { Cone } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector2, Raycaster, Euler, Quaternion } from 'three';

//TODO Put a frames/second thing on my project

// Used for the Bezier Curve
import { Line, BufferGeometry, LineBasicMaterial } from 'three';

function modPi(angle) {
    return ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

function simplifyRotation(rotation) {
    return rotation.map(angle => {
        const simplifiedAngle = modPi(angle);
        console.log(angle, simplifiedAngle)
        return simplifiedAngle > Math.PI ? simplifiedAngle - 2 * Math.PI : simplifiedAngle;
    });
}

function areRotationsEqual(rotation1, rotation2) {
    const quaternion1 = new Quaternion().setFromEuler(new Euler(...rotation1));
    const quaternion2 = new Quaternion().setFromEuler(new Euler(...rotation2));

    return quaternion1.equals(quaternion2);
}


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
        '+y': [0, 0, Math.PI],
        '-y': [0, 0, 0],
        '+z': [- Math.PI/2, 0, 0],
        '-z': [Math.PI/2, 0, 0],
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

function calculateLookAtRotation2(target) {

    const dummyObject = new Object3D();
    dummyObject.lookAt(target);
    dummyObject.rotateOnAxis(new Vector3(1, 0, 0), - Math.PI / 2)
    dummyObject.updateMatrixWorld();  // Ensure the world matrix is updated
    // console.log(target, [dummyObject.rotation.x, dummyObject.rotation.y, dummyObject.rotation.z])
    return [dummyObject.rotation.x, dummyObject.rotation.y, dummyObject.rotation.z]
}

const offsetRotation = (rotation) => {
    return addArrays(rotation, [ 0 , 0, 0])
}


/**
 * TESTING MOVEMENT
 * [-1, -1, 1]
 * [-1, 0, 1]
 * [-1, 1, 1],
 * [0, -1, 1]
 * [0, 0, 1] - Works, faces +z to start
 * [0, 1, 1]
 * [1, -1, 1]
 * [1, 0, 1],
 * [1, 1, 1]
 */

const Soldier = forwardRef(({position, rotation, setPosition, setRotation, name, color, movingMode, setMovingMode, currentSelectedPose, setCurrentSelectedPose, setSelectedSoldier}, ref) => {

    const [bezierCurve, setBezierCurve] = useState(null)

    const { scene } = useThree();
    useEffect(() => {

    
        // Draw the new Bezier Curve
        if (bezierCurve) {
            const points = bezierCurve.getPoints(50);
            const geometry = new BufferGeometry().setFromPoints(points);
            const material = new LineBasicMaterial({ color : 0xff0000 });
            const curve = new Line(geometry, material);
            scene.add(curve);

        }
    }, [bezierCurve, scene]);

    useEffect(() => {
        // console.log('Current Selected Pose',currentSelectedPose)
    }, [currentSelectedPose])

    useEffect(() => {
        // console.log(rotation)
    }, [rotation])

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
    let startPosition = useRef(null)
    let startRotation = useRef(null)
    const PHASE_3_DURATION = 1
    const PHASE_2_DURATION = 3

    useFrame((state, delta) => {
        const elapsedTime = state.clock.getElapsedTime()

        if (movingMode && animationPhase.current === 'Phase 1') {

            setBezierCurve(getBezierCurve(
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

            const t = (elapsedTime - startTime.current) / PHASE_2_DURATION

            if (t < 1) {

                const newRotation = startRotation.current.map((el, index) => {
                    return el + t * (phase2Rotation[index] - el)
                })
                // console.log('New Rotation is', newRotation)
                setRotation(newRotation)
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

            // console.log(areRotationsEqual([Math.PI / 2, 0, 0], [-Math.PI / 2, 0, Math.PI]))

            const t = (elapsedTime - PHASE_3_DURATION - PHASE_2_DURATION - startTime.current) / PHASE_2_DURATION

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
                name={name}
                args={[0.4, 0.8]} 
                position={position} 
                rotation={rotation}
                material-color={color}      
            />
    )
})

export default Soldier