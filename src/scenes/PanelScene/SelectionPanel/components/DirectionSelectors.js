import React, {useEffect, useState} from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';


const DirectionSelectors = ({panelSize, directionSelectorSize, moveSelectorSize, selectorOffsetSize}) => {

    const [halfSelectorOffsetSize, setHalfSelectorOffsetSize] = useState(selectorOffsetSize / 2)

    /**
     * Re-calculate the halfSelectorOffsetSize when the selectorOffsetSize changes
     */
    useEffect (() => {
        setHalfSelectorOffsetSize(selectorOffsetSize / 2)
    }, [selectorOffsetSize])

    const directionSelectorPoints1 = [
        [0 + halfSelectorOffsetSize, 0 - halfSelectorOffsetSize],
        [directionSelectorSize + halfSelectorOffsetSize, directionSelectorSize - halfSelectorOffsetSize],
        [panelSize - directionSelectorSize - halfSelectorOffsetSize, directionSelectorSize - halfSelectorOffsetSize],
        [panelSize - halfSelectorOffsetSize, 0 - halfSelectorOffsetSize]
    ]
    const directionSelectorPoints2 = [
        [0 + halfSelectorOffsetSize, panelSize + halfSelectorOffsetSize],
        [directionSelectorSize + halfSelectorOffsetSize, panelSize - directionSelectorSize + halfSelectorOffsetSize],
        [panelSize - directionSelectorSize - halfSelectorOffsetSize, panelSize - directionSelectorSize + halfSelectorOffsetSize],
        [panelSize - halfSelectorOffsetSize, panelSize + halfSelectorOffsetSize]
    ]
    const directionSelectorPoints3 = [
        [0 - halfSelectorOffsetSize, 0 + halfSelectorOffsetSize],
        [directionSelectorSize - halfSelectorOffsetSize, directionSelectorSize + halfSelectorOffsetSize],
        [directionSelectorSize - halfSelectorOffsetSize, panelSize - directionSelectorSize - halfSelectorOffsetSize],
        [0 - halfSelectorOffsetSize, panelSize - halfSelectorOffsetSize]
    ]
    const directionSelectorPoints4 = [
        [panelSize + halfSelectorOffsetSize, 0 + halfSelectorOffsetSize],
        [panelSize - directionSelectorSize + halfSelectorOffsetSize, directionSelectorSize + halfSelectorOffsetSize],
        [panelSize - directionSelectorSize + halfSelectorOffsetSize, panelSize - directionSelectorSize - halfSelectorOffsetSize],
        [panelSize + halfSelectorOffsetSize, panelSize - halfSelectorOffsetSize]
    ]

    const directionSelectors = {
        'up': {
            points: directionSelectorPoints1,
        },
        'down': {
            points: directionSelectorPoints2,
        },
        'left': {
            points: directionSelectorPoints3,
        },
        'right': {
            points: directionSelectorPoints4,
        }
    }

    return (
        <Layer>
            <Line
                points={directionSelectorPoints1.flat()}
                fill="#00D2FF"
                closed
            />
            <Line
                points={directionSelectorPoints2.flat()}
                fill="#00D2FF"
                closed
            />
            <Line
                points={directionSelectorPoints3.flat()}
                fill="#00D2FF"
                closed
            />
            <Line
                points={directionSelectorPoints4.flat()}
                fill="#00D2FF"
                closed
            />
        </Layer>
    );
};

export default DirectionSelectors;