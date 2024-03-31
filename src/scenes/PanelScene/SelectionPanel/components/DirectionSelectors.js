import React, {useEffect, useState} from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import {useControls, folder} from 'leva';


const DirectionSelectors = ({panelSize, directionSelectorSize, moveSelectorSize, selectorOffsetSize, directionMap}) => {

    const { directionSelectiorDefaultColor, directionSelectiorHoveredColor, directionSelectiorSelectedColor, directionSelectiorBlockedColor } = useControls('Selection Panel', {
        'Colors': folder({
            directionSelectiorDefaultColor: '#00D2FF',
            directionSelectiorHoveredColor: '#FF00D2',
            directionSelectiorSelectedColor: '#D200FF',
            directionSelectiorBlockedColor: '#FFD200'
        })
    })


    const [halfSelectorOffsetSize, setHalfSelectorOffsetSize] = useState(selectorOffsetSize / 2)

    /**
     * Re-calculate the halfSelectorOffsetSize when the selectorOffsetSize changes
     */
    useEffect (() => {
        setHalfSelectorOffsetSize(selectorOffsetSize / 2)
    }, [selectorOffsetSize])

    const directionSelectors = {
        'up': {
            points: [
                [0 + halfSelectorOffsetSize, 0 - halfSelectorOffsetSize],
                [directionSelectorSize + halfSelectorOffsetSize, directionSelectorSize - halfSelectorOffsetSize],
                [panelSize - directionSelectorSize - halfSelectorOffsetSize, directionSelectorSize - halfSelectorOffsetSize],
                [panelSize - halfSelectorOffsetSize, 0 - halfSelectorOffsetSize]
            ],
        },
        'down': {
            points: [
                [0 + halfSelectorOffsetSize, panelSize + halfSelectorOffsetSize],
                [directionSelectorSize + halfSelectorOffsetSize, panelSize - directionSelectorSize + halfSelectorOffsetSize],
                [panelSize - directionSelectorSize - halfSelectorOffsetSize, panelSize - directionSelectorSize + halfSelectorOffsetSize],
                [panelSize - halfSelectorOffsetSize, panelSize + halfSelectorOffsetSize]
            ],
        },
        'left': {
            points: [
                [0 - halfSelectorOffsetSize, 0 + halfSelectorOffsetSize],
                [directionSelectorSize - halfSelectorOffsetSize, directionSelectorSize + halfSelectorOffsetSize],
                [directionSelectorSize - halfSelectorOffsetSize, panelSize - directionSelectorSize - halfSelectorOffsetSize],
                [0 - halfSelectorOffsetSize, panelSize - halfSelectorOffsetSize]
            ],
        },
        'right': {
            points: [
                [panelSize + halfSelectorOffsetSize, 0 + halfSelectorOffsetSize],
                [panelSize - directionSelectorSize + halfSelectorOffsetSize, directionSelectorSize + halfSelectorOffsetSize],
                [panelSize - directionSelectorSize + halfSelectorOffsetSize, panelSize - directionSelectorSize - halfSelectorOffsetSize],
                [panelSize + halfSelectorOffsetSize, panelSize - halfSelectorOffsetSize]
            ],
        }
    }

    return (
        <Layer>
            <Line
                points={directionSelectors['up'].points.flat()}
                fill="#00D2FF"
                closed
            />
            <Line
                points={directionSelectors['down'].points.flat()}
                fill="#00D2FF"
                closed
            />
            <Line
                points={directionSelectors['left'].points.flat()}
                fill="#00D2FF"
                closed
            />
            <Line
                points={directionSelectors['right'].points.flat()}
                fill="#00D2FF"
                closed
            />
        </Layer>
    );
};

export default DirectionSelectors;