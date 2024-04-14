import { Cone } from "@react-three/drei"
import React, { useState, useEffect, forwardRef, useRef } from "react"
import { centerCoord, getMovePath, getRelativeDirectionArray, getQuaternionFromLookAt } from '../../../../utils/displayHelpers'
import { useFrame } from "react-three-fiber"
import { Vector3 } from "three"
import {useControls, folder} from "leva"

/**
 * move in an object with the following structure:
 * {
 *      currentPose: {
 *          position: [x, y, z],
 *          direction: '+z'
 *      },
 *      targetPose: {
 *          position: [x, y, z],
 *          direction: '+z'
 *      }
 * }
 */

//TODO: Need to offset the position before updating
const Soldier2 = forwardRef(({
    initialPosition,
    initialQuaternionRotation,
    move,
    onMoveCompletion
}, ref) => {

    /**
     * Set the rotation and position of the soldier when the component is mounted
     */
    useEffect(() => {
        if (ref.current) {
            if (initialQuaternionRotation) {
                ref.current.quaternion.copy(initialQuaternionRotation)
            }
            if (initialPosition) {
                ref.current.position.set(...initialPosition)
            }
        }
    }, [initialPosition, initialQuaternionRotation, ref])


    let moveState = useRef({
        activated: false,
        animationPhase: 0,
        movePath: null,
        quaternionStates: {
            currentPose: null,
            startMovePath: null,
            endMovePath: null,
            targetPose: null
        }
    })


    /**
     * Once a move has been passed down by the props, set moveActivated to true
     */
    useEffect(() => {
        if (move) {
            const {currentPose, targetPose} = move
            const movePath = getMovePath(currentPose, targetPose)

            /**
             * Start and end tangent of the move path
             */
            const startMovePathTangent = movePath.getTangentAt(0)
            const endMovePathTangent = movePath.getTangentAt(1)

            /**
             * Tangents of the current and target poses
             */
            const currentPoseTangent = new Vector3(...getRelativeDirectionArray(currentPose.direction))
            const targetPoseTangent = new Vector3(...getRelativeDirectionArray(targetPose.direction))

            /**
             * Determine if we can skip Phases 2 & 4 //TODO: Implement this
             */
            const phase1Skip = currentPoseTangent.equals(startMovePathTangent)
            const phase3Skip = endMovePathTangent.equals(targetPoseTangent)


            moveState.current = {
                activated: true,
                animationPhase: 1,
                movePath: movePath,
                animationPhaseStartTime: performance.now(),
                quaternionStates: {
                    currentPose: getQuaternionFromLookAt(currentPoseTangent),
                    startMovePath: getQuaternionFromLookAt(startMovePathTangent),
                    endMovePath: getQuaternionFromLookAt(endMovePathTangent),
                    targetPose: getQuaternionFromLookAt(targetPoseTangent)
                },
                phaseSkips: {
                    phase1Skip: phase1Skip,
                    phase3Skip: phase3Skip
                }
            }
        }
    }, [move])

    const { phase1Time, phase2Time, phase3Time } = useControls({
        phase1Time: { value: 1, min: 0, max: 10, step: 0.1 },
        phase2Time: { value: 2, min: 0, max: 10, step: 0.1 },
        phase3Time: { value: 1, min: 0, max: 10, step: 0.1 },
    })

    useFrame((state, delta) => {
        
        switch (moveState.current.animationPhase) {
            case 1: {
                /**
                 * Adjust the Soldiers rotation to face the rotation of the move path
                 */
                if (moveState.current.phaseSkips.phase1Skip) {
                    moveState.current = {
                        ...moveState.current,
                        animationPhaseStartTime: performance.now(),
                        animationPhase: 2
                    }
                    break
                }

                const elapsedTime = performance.now() - moveState.current.animationPhaseStartTime;
                const phase1Duration = phase1Time * 1000;
                const t = elapsedTime / phase1Duration;

                if (t > 1) {
                    const startRotation = moveState.current.quaternionStates.currentPose;
                    const endRotation = moveState.current.quaternionStates.startMovePath;
                    const newRotation = startRotation.clone().slerp(endRotation, t);

                    // Update the soldier's rotation
                    ref.current.quaternion.copy(newRotation);
                } else {
                    moveState.current = {
                        ...moveState.current,
                        animationPhaseStartTime: performance.now(),
                        animationPhase: 2
                    }
                }
                break
            }

            case 2:{
                /**
                 * Move the Soldiers position and rotation along the move path
                 */
                const elapsedTime = performance.now() - moveState.current.animationPhaseStartTime;
                const phase2Duration = phase2Time * 1000;
                const t = elapsedTime / phase2Duration;

                if (t < 1) {
                    const currentPoint = moveState.current.movePath.getPointAt(t)
                    ref.current.position.set(currentPoint.x, currentPoint.y, currentPoint.z);

                    const currentTangent = moveState.current.movePath.getTangentAt(t)
                    const currentRotation = getQuaternionFromLookAt(currentTangent)
                    ref.current.quaternion.copy(currentRotation)
                } else {
                    moveState.current = {
                        ...moveState.current,
                        animationPhaseStartTime: performance.now(),
                        animationPhase: 3
                    }
                }
                break
            }

            case 3: {
                /**
                 * Adjust the Soldiers rotation to face the rotation of the target pose
                 */
                if (moveState.current.phaseSkips.phase3Skip) {
                    moveState.current = {
                        ...moveState,
                        animationPhaseStartTime: performance.now(),
                        animationPhase: 4
                    }
                    break
                }

                const elapsedTime = performance.now() - moveState.current.animationPhaseStartTime;
                const phase3Duration = phase3Time * 1000;
                const t = elapsedTime / phase3Duration;

                if (t > 1) {
                    const startRotation = moveState.current.quaternionStates.endMovePath;
                    const endRotation = moveState.current.quaternionStates.targetPose;
                    const newRotation = startRotation.clone().slerp(endRotation, t);

                    // Update the soldier's rotation
                    ref.current.quaternion.copy(newRotation);
                } else {
                    moveState.current = {
                        ...moveState.current,
                        animationPhaseStartTime: performance.now(),
                        animationPhase: 4
                    }
                }
                break
            }
            case 4: {
                /**
                 * Position and rotation correction (if necessary)
                 */

                const targetPose = moveState.current.quaternionStates.targetPose
                ref.current.quaternion.copy(targetPose)

                const targetPoint = moveState.current.movePath.getPointAt(1)
                ref.current.position.set(targetPoint.x, targetPoint.y, targetPoint.z)

                moveState.current = {
                    ...moveState.current,
                    activated: false,
                    animationPhase: 0,
                    movePath: null,
                    quaternionStates: {
                        currentPose: null,
                        startMovePath: null,
                        endMovePath: null,
                        targetPose: null
                    }
                }
                onMoveCompletion()
                break;
            }
            default:
                break
        }

    })

    return (
        <Cone
            args={[0.4, 0.8]} 
        />
    )
})

export default Soldier2;