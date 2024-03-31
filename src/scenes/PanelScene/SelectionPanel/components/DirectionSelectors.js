import React, {useEffect, useState} from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import {useControls, folder} from 'leva';

const getOpposingDirection = (direction) => {
    const polarity = direction[0]

    if (polarity === '+') {
        return '-' + direction[1]
    } else {
        return '+' + direction[1]
    }
}

const DirectionSelectors = ({panelSize, directionSelectorSize, moveSelectorSize, selectorOffsetSize, directionMap, setDirectionMap}) => {

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

    const updateDirections = (selectedDirection) => {
        if (selectedDirection === 'up') {
            setDirectionMap({
                face: directionMap.up,
                left: directionMap.left,
                right: directionMap.right,
                up: getOpposingDirection(directionMap.face),
                down: directionMap.face
            })
        } else if (selectedDirection === 'down') {
            setDirectionMap({
                face: directionMap.down,
                left: directionMap.left,
                right: directionMap.right,
                up: directionMap.face,
                down: getOpposingDirection(directionMap.face)
            })
        } else if (selectedDirection === 'left') {
            setDirectionMap({
                face: directionMap.left,
                left: getOpposingDirection(directionMap.face),
                right: directionMap.face,
                up: directionMap.up,
                down: directionMap.down
            })
        } else if (selectedDirection === 'right') {
            setDirectionMap({
                face: directionMap.right,
                left: directionMap.face,
                right: getOpposingDirection(directionMap.face),
                up: directionMap.up,
                down: directionMap.down
            })
        }
    }


    const handleMouseEnter = (e) => {
        // Change the color of the square when the mouse enters
        e.target.fill(directionSelectiorHoveredColor);
        e.target.draw();
    };

    const handleMouseLeave = (e) => {
        // Change the color back when the mouse leaves
        e.target.fill(directionSelectiorDefaultColor);
        e.target.draw();
    };

    const handleClick = ( e) => {
        // Do something when the square is clicked
        e.target.fill(directionSelectiorSelectedColor);
        e.target.draw();
        const directionClicked = e.target.name()
        updateDirections(directionClicked)

    };

    const directionSelectors = {
        'up': {
            points: [
                [0 + halfSelectorOffsetSize, 0 - halfSelectorOffsetSize],
                [directionSelectorSize + halfSelectorOffsetSize, directionSelectorSize - halfSelectorOffsetSize],
                [panelSize - directionSelectorSize - halfSelectorOffsetSize, directionSelectorSize - halfSelectorOffsetSize],
                [panelSize - halfSelectorOffsetSize, 0 - halfSelectorOffsetSize]
            ]
        },
        'down': {
            points: [
                [0 + halfSelectorOffsetSize, panelSize + halfSelectorOffsetSize],
                [directionSelectorSize + halfSelectorOffsetSize, panelSize - directionSelectorSize + halfSelectorOffsetSize],
                [panelSize - directionSelectorSize - halfSelectorOffsetSize, panelSize - directionSelectorSize + halfSelectorOffsetSize],
                [panelSize - halfSelectorOffsetSize, panelSize + halfSelectorOffsetSize]
            ]
        },
        'left': {
            points: [
                [0 - halfSelectorOffsetSize, 0 + halfSelectorOffsetSize],
                [directionSelectorSize - halfSelectorOffsetSize, directionSelectorSize + halfSelectorOffsetSize],
                [directionSelectorSize - halfSelectorOffsetSize, panelSize - directionSelectorSize - halfSelectorOffsetSize],
                [0 - halfSelectorOffsetSize, panelSize - halfSelectorOffsetSize]
            ]
        },
        'right': {
            points: [
                [panelSize + halfSelectorOffsetSize, 0 + halfSelectorOffsetSize],
                [panelSize - directionSelectorSize + halfSelectorOffsetSize, directionSelectorSize + halfSelectorOffsetSize],
                [panelSize - directionSelectorSize + halfSelectorOffsetSize, panelSize - directionSelectorSize - halfSelectorOffsetSize],
                [panelSize + halfSelectorOffsetSize, panelSize - halfSelectorOffsetSize]
            ]
        }
    }

    return (
        <Layer>
            {['up', 'down', 'left', 'right'].map(direction => (
                <Line
                    name={direction}
                    key={direction}
                    points={directionSelectors[direction].points.flat()}
                    fill={directionSelectiorDefaultColor}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleClick}
                    closed
                />
            ))}
        </Layer>
    );
};

export default DirectionSelectors;