import React, { useState, useRef, useEffect, useCallback } from "react"
import { Cone } from "@react-three/drei"
import { getRotationFromDirection, getRelativeDirectionArray } from "../../../../utils/directionHelpers"
import { useFrame } from "react-three-fiber"
import { getMovePath, getLookAtRotation, getShortestRotationQuaternion, convertEulerToQuaternion, getQuaternionFromLookAt } from '../../../../utils/displayHelpers'
import { addArrays } from "../../../../utils/arrayHelpers"
import { Vector3, Quaternion } from "three"
import { allPropertiesNotNull } from "../../../../utils/miscHelpers"



const Soldier2 = ({
    color,
    soldier,
    phaseTimes,
    movingMode, 
    setMovingMode,
    currentSelectedPose,
    selectedSoldier
}) => {

    const [position, setPosition] = useState(soldier.gamePosition)
    const [rotation, setRotation] = useState(getQuaternionFromLookAt(new Vector3(...getRelativeDirectionArray(soldier.direction))))
    const [isSelectedSoldier, setIsSelectedSoldier] = useState(false)


    const {phase2Duration, phase3Duration, phase4Duration} = phaseTimes
    const soldierRef = useRef()

    /**
     * Check if this Soldier is the one currently selected
     */
    useEffect(() => {
        if (selectedSoldier && selectedSoldier.uuid === soldierRef.current.uuid) {
            setIsSelectedSoldier(true)
        } else {
            setIsSelectedSoldier(false)
        }
    }, [selectedSoldier])

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

    // TODO: Implement phaseSkips
    let phaseSkips = useRef({
        phase2Skipped: false,
        phase4Skipped: false
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
    })


    useEffect(() => {
        if (bezierCurve && movePoses) {
            let startMoveTangent = bezierCurve.getTangentAt(0)
            let finishMoveTangent = bezierCurve.getTangentAt(1)

            let startLookAtRotation = new Vector3(...getRelativeDirectionArray(movePoses.current.startDirection))
            let finishLookAtRotation = new Vector3(...getRelativeDirectionArray(movePoses.current.finishDirection))

            console.log(startMoveTangent, startLookAtRotation)

            moveRotations.current = {
                startRotationQuaternion: getQuaternionFromLookAt(startLookAtRotation),
                finishRotationQuaternion: getQuaternionFromLookAt(finishLookAtRotation),
                startMovePathRotationQuaternion: getQuaternionFromLookAt(startMoveTangent),
                finishMovePathRotationQuaternion: getQuaternionFromLookAt(finishMoveTangent)
            }

            console.log(moveRotations.current)
        }

    }, [bezierCurve, movePoses])

    /**
     * When moving mode is activated, set the moving parameters is an only if the Soldier is the selected one
     */
    useEffect(() => {

        if (movingMode && isSelectedSoldier) {
            movePoses.current = updateMovePoses()
            setBezierCurve(updateBezierCurve())
        } else {
            setBezierCurve(null)
            movePoses.current = null
            moveRotations.current = null
        }
    }, [movingMode, isSelectedSoldier, updateMovePoses])

    /**
     * Conditions for entering Phase 2 (beginning of animation) 
     */
    useEffect(() => {
        if (moveRotations) {

        }
        const areMoveRotationsDefined = Boolean(moveRotations.current)
        const areMovePosesNotDefined = Boolean(movePoses.current);
        const isBezierCurveDefined = Boolean(bezierCurve);
        const isAnimationPhaseOne = animationPhase.current === 1;

        if (areMoveRotationsDefined && areMovePosesNotDefined && isBezierCurveDefined && isAnimationPhaseOne) {
            animationPhase.current = 2;
        }

    }, [moveRotations, movePoses, bezierCurve, animationPhase])


    useFrame((state, delta) => {

        const elapsedTime = state.clock.getElapsedTime()


        if (movingMode && isSelectedSoldier && animationPhase.current === 1) {
            startTime.current = state.clock.getElapsedTime()
        } else if (animationPhase.current === 2) {
            const t = (elapsedTime - startTime.current) / phase2Duration

            if (t < 1) {
                soldierRef.current.quaternion.copy(moveRotations.current.startRotationQuaternion).slerp(moveRotations.current.startMovePathRotationQuaternion, t);
            } else {
                animationPhase.current = 3
            }
        } 
        else if (animationPhase.current === 3) {
            const t = (elapsedTime - phase2Duration - startTime.current) / phase3Duration

            if (t < 1) {
                const currentPosition = bezierCurve.getPointAt(t)
                const currentTangent = bezierCurve.getTangentAt(t)
                // const currentRotation = getLookAtRotation(currentTangent)
                const currentRotationQuaternion = getQuaternionFromLookAt(currentTangent)

                setPosition([currentPosition.x, currentPosition.y, currentPosition.z])
                setRotation(currentRotationQuaternion)

            } else {
                animationPhase.current = 4
            }
        } 
        else if (animationPhase.current === 4) {
            const t = (elapsedTime - phase2Duration - phase3Duration - startTime.current) / phase4Duration

            if (t < 1) {
                soldierRef.current.quaternion.copy(moveRotations.current.finishMovePathRotationQuaternion).slerp(moveRotations.current.finishRotationQuaternion, t);
            } else {
                animationPhase.current = 5
            }
        } else if (animationPhase.current === 5) {
            setMovingMode(false)
            startTime.current = null

            animationPhase.current = 6
        } else if (animationPhase.current === 6 && !movingMode) {
            animationPhase.current = 1
        }

    })

    useEffect(() => {
        if (soldierRef.current) {
            soldierRef.current.quaternion.copy(rotation)
        }
    }, [rotation])

    return (

        <Cone
            ref={soldierRef}
            args={[0.4, 0.8]} 
            position={position} 
            material-color={color}    
        />
    )
}

export default Soldier2