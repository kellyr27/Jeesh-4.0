import React, { useState, useRef, useEffect, useCallback, memo, forwardRef } from "react"
import { Cone } from "@react-three/drei"
import { getRelativeDirectionArray } from "../../../../utils/directionHelpers"
import { useFrame } from "react-three-fiber"
import { getMovePath,  getQuaternionFromLookAt, centerCoord } from '../../../../utils/displayHelpers'
import { addArrays } from "../../../../utils/arrayHelpers"
import { Vector3 } from "three"
import PastLine from "./PastLine/PastLine"

function getPointsUpTo(bezierCurve, numPoints, endPosition) {

    if (!bezierCurve || numPoints <= 0 || endPosition <= 0) {
        return []
    }

    const points = [];

    for (let i = 0; i < numPoints; i++) {
        let t = i / (numPoints - 1) * endPosition;
        t = Math.min(t, 1)

        const point = bezierCurve.getPointAt(t);

        points.push(point);
    }


    return points;
}


const Soldier = memo(forwardRef(({
    soldierId,
    color,
    soldier,
    phaseTimes,
    currentSelectedPose,
    selectedSoldier,
    movingModeActivate,
    setMovingModeActivate,
    movingModeDeactivate,
    setMovingModeDeactivate
}, ref) => {

    const [pastLines, setPastLines] = useState([])
    const [currentLine, setCurrentLine] = useState([])
    const [moveLineToCurrentLine, setMoveLineToCurrentLine] = useState(false)

    const [position, setPosition] = useState(soldier.gamePosition)
    const [rotation, setRotation] = useState(getQuaternionFromLookAt(new Vector3(...getRelativeDirectionArray(soldier.direction))))
    const [isSelectedSoldier, setIsSelectedSoldier] = useState(false)

    const {phase2Duration, phase3Duration, phase4Duration} = phaseTimes

    /**
     * Check if this Soldier is the one currently selected
     */
    useEffect(() => {
        if (selectedSoldier && selectedSoldier.uuid === ref.current.uuid) {
            setIsSelectedSoldier(true)
        } else {
            setIsSelectedSoldier(false)
        }
    }, [selectedSoldier, ref])

    /**
     * For animation of the Soldier, we use different Phases
     * 
     * Phase 1 - Pre-movement. Set all the variables needed for the movement.
     * Phase 2 - Rotate Soldier to the face the inital rotation of the curve.
     *           If already facing the right direction, skip this phase
     * Phase 3 - Move the Soldier along the curve
     * Phase 4 - Rotation correction
     * Phase 5 - Post-movement. Reset all the variables.
     * 
     */
    let animationPhase = useRef(1)
    let startTime = useRef(null)

    const [phaseSkips, setPhaseSkips] = useState({
        phase2: false,
        phase4: false
    })

    let moveRotations = useRef(null)
    let movePoses = useRef(null)
    const [bezierCurve, setBezierCurve] = useState(null)

    const updateMovePoses = useCallback(() => {
        return {
            startPosition: soldier.gamePosition,
            finishPosition: addArrays(currentSelectedPose.position, soldier.gamePosition),
            startDirection: soldier.direction,
            finishDirection: currentSelectedPose.direction
        }
    }, [soldier.gamePosition, soldier.direction, currentSelectedPose]);

    const updateBezierCurve = useCallback(() => {

        return getMovePath(
            {
                position: movePoses.current.startPosition,
            }, 
            {
                position: movePoses.current.finishPosition,
                direction: movePoses.current.finishDirection
            }
        );
    }, [movePoses])


    useEffect(() => {
        if (bezierCurve && movePoses) {
            let startMoveTangent = bezierCurve.getTangentAt(0)
            let finishMoveTangent = bezierCurve.getTangentAt(1)

            let startLookAtRotation = new Vector3(...getRelativeDirectionArray(movePoses.current.startDirection))
            let finishLookAtRotation = new Vector3(...getRelativeDirectionArray(movePoses.current.finishDirection))

            // Set Phase Skips
            setPhaseSkips({
                phase2: startMoveTangent.equals(startLookAtRotation),
                phase4: finishMoveTangent.equals(finishLookAtRotation)
            })


            moveRotations.current = {
                startRotationQuaternion: getQuaternionFromLookAt(startLookAtRotation),
                finishRotationQuaternion: getQuaternionFromLookAt(finishLookAtRotation),
                startMovePathRotationQuaternion: getQuaternionFromLookAt(startMoveTangent),
                finishMovePathRotationQuaternion: getQuaternionFromLookAt(finishMoveTangent)
            }

        }

    }, [bezierCurve, movePoses])


    /**
     * When moving mode is activated
     * - Set the moving parameters is an only if the Soldier is the selected one
     * 
     */
    useEffect(() => {

        if (movingModeActivate && isSelectedSoldier) {
            movePoses.current = updateMovePoses()
            setBezierCurve(updateBezierCurve())

        } else {
            setBezierCurve(null)
            movePoses.current = null
            moveRotations.current = null
        }
    }, [movingModeActivate, isSelectedSoldier, updateMovePoses, updateBezierCurve])

    /**
     * Conditions for entering Phase 2 (beginning of animation) 
     */
    useEffect(() => {
    
        const areMoveRotationsDefined = Boolean(moveRotations.current)
        const areMovePosesNotDefined = Boolean(movePoses.current);
        const isBezierCurveDefined = Boolean(bezierCurve);
        const isAnimationPhaseOne = animationPhase.current === 1;

        if (areMoveRotationsDefined && areMovePosesNotDefined && isBezierCurveDefined && isAnimationPhaseOne) {
            animationPhase.current = 2;
        }

    }, [moveRotations, movePoses, bezierCurve, animationPhase])

    /**
     * For reuse in useFrame to avoid overhead of object creation
     */
    const currentPhase3Position = new Vector3();
    const currentPhase3Tangent = new Vector3();

    useFrame((state, delta) => {

        const elapsedTime = state.clock.getElapsedTime()

        /**
         * A switch case statement can be faster than if-else because it doesnt need to check all conditions sequentially
         */

        switch (animationPhase.current) {
            case 1:
                if (movingModeActivate && isSelectedSoldier) {
                    startTime.current = elapsedTime
                }
                break
            case 2:
                if (phaseSkips.phase2) {
                    animationPhase.current = 3
                }
                const t2 = (elapsedTime - startTime.current) / phase2Duration
                if (t2 < 1) {
                    ref.current.quaternion.copy(moveRotations.current.startRotationQuaternion).slerp(moveRotations.current.startMovePathRotationQuaternion, t2)
                } else {
                    animationPhase.current = 3
                }
                break
            case 3:
                const t3 = (elapsedTime - phase2Duration - startTime.current) / phase3Duration
                if (t3 < 1) {
                    bezierCurve.getPointAt(t3, currentPhase3Position)
                    bezierCurve.getTangentAt(t3, currentPhase3Tangent)
                    const currentRotationQuaternion = getQuaternionFromLookAt(currentPhase3Tangent)
    
                    setPosition(currentPhase3Position)
                    setRotation(currentRotationQuaternion)

                    // Set the PastLine
                    const pastLinePoints = getPointsUpTo(bezierCurve, 10, t3)
                    setCurrentLine(pastLinePoints)

                } else {
                    animationPhase.current = 4
                }
                break
            case 4:
                if (phaseSkips.phase4) {
                    animationPhase.current = 5
                }
                const t4 = (elapsedTime - phase2Duration - phase3Duration - startTime.current) / phase4Duration
                if (t4 < 1) {
                    ref.current.quaternion.copy(moveRotations.current.finishMovePathRotationQuaternion).slerp(moveRotations.current.finishRotationQuaternion, t4)
                } else {
                    animationPhase.current = 5
                }
                break
            case 5:
                setMovingModeActivate(false)
                startTime.current = null
                animationPhase.current = 6
                break
            case 6:
                if (!movingModeActivate) {
                    animationPhase.current = 1
                }
                break
            default:
                break
        }

    })

    useEffect(() => {
        if (ref.current) {
            ref.current.quaternion.copy(rotation)
        }
    }, [rotation, ref])

    useEffect(() => {
        if (movingModeDeactivate) {

            setMoveLineToCurrentLine(true)
        }
    }, [movingModeDeactivate])

    useEffect(() => {
        if (moveLineToCurrentLine) {
            setPastLines(pastLines => [...pastLines, currentLine])
            setCurrentLine([])
            setMoveLineToCurrentLine(false)
        }
    }, [moveLineToCurrentLine, currentLine, pastLines])

    return (
        <>
            {pastLines.length > 0 && pastLines.map((line, index) => {
                return (
                    line.length > 0 ? (
                        <PastLine
                            key={index}
                            vector3Points={line}
                        />
                    ) : null
                )
            })}
            {currentLine.length > 0 && (
                <PastLine
                    vector3Points={currentLine}
                />
            )}
            <Cone
                ref={ref}
                args={[0.4, 0.8]} 
                position={centerCoord(position)} 
                material-color={color}
                name={`Soldier-${soldierId}`}
            />
        </>
    )
}))

export default Soldier