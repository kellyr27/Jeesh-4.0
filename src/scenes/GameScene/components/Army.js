import React, {useEffect, useState, useRef} from 'react'
import { useFrame } from 'react-three-fiber';
import { Vector3, CubicBezierCurve3 } from 'three'
import Soldier from './Soldier'
import getRelativeDirectionArray from '../../../utils/getRelativeDirectionArray';
import { subtractArrays, addArrays } from '../../../utils/arrayHelpers'


const getBezierCurve = (pose1, pose2) => {
    // console.log(pose1, pose2)

    const { position: position1, direction: direction1 } = pose1
    const { position: position2, direction: direction2 } = pose2

    // Find the control point for the curve
    const controlPoint = subtractArrays(position2, getRelativeDirectionArray(direction2))

    const curve = new CubicBezierCurve3(
        new Vector3(...position1),
        new Vector3(...controlPoint),
        new Vector3(...position2)
    )

    return curve
}

const Army = () => {

    const [soldier1Position, setSoldier1Position] = useState([0, 0, 0])
    const [startTime, setStartTime] = useState(null)
    const [bezierCurve, setBezierCurve] = useState(null)
    const [activate, setActivate] = useState(false)
    const [firstActivation, setFirstActivation] = useState(true)

    const testPoses = [
        {
            position: [0, 0, 0],
            direction: '+z'
        },
        {
            position: [1, 1, 1], 
            direction: '+x'
        },
        {
            position: [1, 2, 1], 
            direction: '+y'
        },
        {
            position: [1, 3, 2], 
            direction: '+z'
        },
        {
            position: [2, 3, 2], 
            direction: '+x'
        },
        {
            position: [2, 2, 2], 
            direction: '-y'
        }
    ]
    const [testPositionIndex, setTestPositionIndex] = useState(0)


    // useFrame((state, delta) => {
    //     const elapsedTime = state.clock.getElapsedTime()
    //     // console.log('Elapsed time', elapsedTime)

    //     if (firstActivation) {
            
    //         setTestPositionIndex(testPositionIndex + 1)
    //         setBezierCurve(getBezierCurve(
    //             testPoses[testPositionIndex], 
    //             testPoses[testPositionIndex + 1]
    //         ))
    //         setStartTime(state.clock.getElapsedTime())
    //         setFirstActivation(false)
    //         setActivate(true)
    //     }

    //     // If the bezier curve is active, update the position of the soldier
    //     if (activate) {
    //         // Assuming 10 seconds to travel from one pose to the next
    //         const t = (elapsedTime - startTime) / 10
    //         if (t < 1) {
    //             const point = bezierCurve.getPointAt(t)
    //             const tangent = bezierCurve.getTangentAt(t)
    //             setSoldier1Position([point.x, point.y, point.z])
    //         } else {
    //             setActivate(false)
    //             setFirstActivation(true)
    //         }
    //     }
    // })

    return (
        <>
            <Soldier position={[0,0,0]} rotation={[0, 0, 0]} color={"#ff0000"} />
        </>
    )
}

export default Army