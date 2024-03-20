import React, {useEffect, useState, useRef} from 'react'
import { useFrame } from 'react-three-fiber';
import Soldier from './Soldier'

const Army = () => {

    const [soldier1Position, setSoldier1Position] = useState([0, 0, 0])

    const testPositions = [
        [0, 0, 0],
        [1, 1, 1],
        [1, 2, 1],
        [1, 3, 2],
        [2, 3, 2],
        [2, 2, 2]
    ]
    const [testPositionIndex, setTestPositionIndex] = useState(0)

    useFrame((state, delta) => {
        const elapsedTime = state.clock.getElapsedTime()

        // After 5 seconds set Soldier1Position to [5,5,5]
        // setTimeout(() => {
        //     setTestPositionIndex(testPositionIndex + 1)
        //     setSoldier1Position(testPositions[testPositionIndex])
        // }, 5000)
    })

    return (
        <>
            <Soldier position={soldier1Position[0]} rotation={[0, 0, 0]} color={"#ff0000"} />
        </>
    )
}

export default Army