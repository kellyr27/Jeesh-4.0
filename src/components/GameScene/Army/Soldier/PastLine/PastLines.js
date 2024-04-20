import {Line} from '@react-three/drei';
import React from 'react';
import {offsetLinePoints, offsetArrLinePoints} from './PastLines.utils'

const PastLines = ({
    pastLines,
    currentLine
}) => {

    const offsetCurrentLinePoints = offsetLinePoints(currentLine)
    const offsetArrPastLinePoints = offsetArrLinePoints(pastLines)

    return (
        <>
            {offsetArrPastLinePoints.length > 0 && offsetArrPastLinePoints.map((points, index) => {
                return (
                    points.length > 0 ? (
                        <Line
                            key={index}
                            points={points}
                            color={'red'}
                            linewidth={10}
                            opacity={1}
                        />
                    ) : null
                )
            })}
            {offsetCurrentLinePoints && <Line
                points={offsetCurrentLinePoints}
                color={'yellow'}
                linewidth={10}
                opacity={1}
            />}
        </>
    );
}

export default PastLines;

