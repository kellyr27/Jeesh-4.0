import { Cone } from "@react-three/drei"
import React, { useState, useEffect, forwardRef, useRef, createRef } from "react"
import { centerCoord, getMovePath, getQuaternionFromLookAt } from '../../../../utils/displayHelpers'
import { useFrame } from "react-three-fiber"
import { Vector3 } from "three"
import {getRelativeDirectionArray} from '../../../../utils/directionHelpers';
import {ARENA_OFFSET} from '../../../../globals'
import PastLines from "./PastLine/PastLines"
import {getPointsUpToT} from './Soldier.utils'
import usePhaseTimeControls from '../../../../controls/usePhaseTimeContols'

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
const Soldier = forwardRef(({
    initialPosition,
    initialQuaternionRotation,
    move,
    onMoveCompletion,
    name
}, ref) => {

    const wireframeMesh = createRef()
    const [pastLinePoints, setPastLinePoints] = useState([])
    const [currentLinePoints, setCurrentLinePoints] = useState(null)

    /**
     * Set the rotation and position of the soldier when the component is mounted
     */
    const [firstMounted, setFirstMounted] = useState(true)
    useEffect(() => {
        if (firstMounted && ref.current && initialQuaternionRotation && initialPosition) {

            // Set the rotation
            ref.current.quaternion.copy(initialQuaternionRotation)
            wireframeMesh.current.quaternion.copy(initialQuaternionRotation)
            
            // Set the position
            const [x, y, z] = initialPosition
            ref.current.position.set(
                x + ARENA_OFFSET,
                y + ARENA_OFFSET,
                z + ARENA_OFFSET
            )
            wireframeMesh.current.position.set(
                x + ARENA_OFFSET,
                y + ARENA_OFFSET,
                z + ARENA_OFFSET
            )

            setFirstMounted(false)
            
        }
    }, [initialPosition, initialQuaternionRotation, ref, firstMounted, wireframeMesh])


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


    const { phase1Time, phase2Time, phase3Time } = usePhaseTimeControls()

    const updateLinePoints = () => {
        setPastLinePoints(pastLinePoints => [...pastLinePoints, currentLinePoints]);
        setCurrentLinePoints(null);
    }

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

                if (t < 1) {
                    const startRotation = moveState.current.quaternionStates.currentPose;
                    const endRotation = moveState.current.quaternionStates.startMovePath;

                    
                    const newRotation = startRotation.clone().slerp(endRotation, t);

                    // Update the soldier's rotation
                    ref.current.quaternion.copy(newRotation);
                    wireframeMesh.current.quaternion.copy(newRotation);
                    
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
                    ref.current.position.set(
                        currentPoint.x + ARENA_OFFSET, 
                        currentPoint.y + ARENA_OFFSET, 
                        currentPoint.z + ARENA_OFFSET
                    )
                    wireframeMesh.current.position.set(
                        currentPoint.x + ARENA_OFFSET, 
                        currentPoint.y + ARENA_OFFSET, 
                        currentPoint.z + ARENA_OFFSET
                    )

                    const currentTangent = moveState.current.movePath.getTangentAt(t)
                    const currentRotation = getQuaternionFromLookAt(currentTangent)
                    ref.current.quaternion.copy(currentRotation)
                    wireframeMesh.current.quaternion.copy(currentRotation)


                    // Update the current line
                    const currentPoints = getPointsUpToT(moveState.current.movePath, t)
                    setCurrentLinePoints(currentPoints)
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
                        ...moveState.current,
                        animationPhaseStartTime: performance.now(),
                        animationPhase: 4
                    }
                    break
                }

                const elapsedTime = performance.now() - moveState.current.animationPhaseStartTime;
                const phase3Duration = phase3Time * 1000;
                const t = elapsedTime / phase3Duration;

                if (t < 1) {
                    const startRotation = moveState.current.quaternionStates.endMovePath;
                    const endRotation = moveState.current.quaternionStates.targetPose;
                    const newRotation = startRotation.clone().slerp(endRotation, t);

                    // Update the soldier's rotation
                    ref.current.quaternion.copy(newRotation);
                    wireframeMesh.current.quaternion.copy(newRotation);
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
                wireframeMesh.current.quaternion.copy(targetPose)

                const targetPoint = moveState.current.movePath.getPointAt(1)
                ref.current.position.set(
                    targetPoint.x + ARENA_OFFSET, 
                    targetPoint.y + ARENA_OFFSET, 
                    targetPoint.z + ARENA_OFFSET
                )
                wireframeMesh.current.position.set(
                    targetPoint.x + ARENA_OFFSET, 
                    targetPoint.y + ARENA_OFFSET, 
                    targetPoint.z + ARENA_OFFSET
                )

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
                updateLinePoints()
                onMoveCompletion()
                break;
            }
            default:
                break
        }

    })

    return (
        <>
            <Cone args={[0.4, 0.8]} ref={ref} name={name} />
            <Cone args={[0.4, 0.8]} ref={wireframeMesh} name={name}>
                <meshBasicMaterial attach="material" wireframe />
            </Cone>
            <PastLines
                pastLines={pastLinePoints}
                currentLine={currentLinePoints}
            />
        </>
    )
})

export default Soldier;