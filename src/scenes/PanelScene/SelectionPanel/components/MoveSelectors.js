import React, {useEffect} from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import {useControls, folder} from 'leva';

const addCoords = (...coords) => {
    return coords.reduce((acc, coord) => {
        return [acc[0] + coord[0], acc[1] + coord[1], acc[2] + coord[2]]
    }, [0,0,0])
}

const checkIfPositionInArray = (position, array) => {
    return array.some((element) => {
        return element[0] === position[0] && element[1] === position[1] && element[2] === position[2]
    })
}

const DIRECTIONS_OFFSETS = {
    '-x': [-1,0,0],
    '+x': [1,0,0],
    '-y': [0,-1,0],
    '+y': [0,1,0],
    '-z': [0,0,-1],
    '+z': [0,0,1]
}

const getRelativePosition = (xOffset, yOffset, directionMap) => {
    if (xOffset === -1 && yOffset === -1) {
        return addCoords(DIRECTIONS_OFFSETS[directionMap.left], DIRECTIONS_OFFSETS[directionMap.up], DIRECTIONS_OFFSETS[directionMap.face])
    } else if (xOffset === 0 && yOffset === -1) {
        return addCoords(DIRECTIONS_OFFSETS[directionMap.up], DIRECTIONS_OFFSETS[directionMap.face])
    } else if (xOffset === 1 && yOffset === -1) {
        return addCoords(DIRECTIONS_OFFSETS[directionMap.right], DIRECTIONS_OFFSETS[directionMap.up], DIRECTIONS_OFFSETS[directionMap.face])
    } else if (xOffset === -1 && yOffset === 0) {
        return addCoords(DIRECTIONS_OFFSETS[directionMap.left], DIRECTIONS_OFFSETS[directionMap.face])
    } else if (xOffset === 0 && yOffset === 0) {
        return addCoords(DIRECTIONS_OFFSETS[directionMap.face])
    } else if (xOffset === 1 && yOffset === 0) {
        return addCoords(DIRECTIONS_OFFSETS[directionMap.right], DIRECTIONS_OFFSETS[directionMap.face])
    } else if (xOffset === -1 && yOffset === 1) {
        return addCoords(DIRECTIONS_OFFSETS[directionMap.left], DIRECTIONS_OFFSETS[directionMap.down], DIRECTIONS_OFFSETS[directionMap.face])
    } else if (xOffset === 0 && yOffset === 1) {
        return addCoords(DIRECTIONS_OFFSETS[directionMap.down], DIRECTIONS_OFFSETS[directionMap.face])
    } else if (xOffset === 1 && yOffset === 1) {
        return addCoords(DIRECTIONS_OFFSETS[directionMap.right], DIRECTIONS_OFFSETS[directionMap.down], DIRECTIONS_OFFSETS[directionMap.face])
    }
}


const MoveSelector = ({ x, y, width, height, fill, onMouseEnter, onMouseLeave, onClick, isBlocked, name}) => {

    
    return (
        <Rect
            name={name}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={fill}
            onMouseEnter={isBlocked ? null : onMouseEnter}
            onMouseLeave={isBlocked ? null : onMouseLeave}
            onClick={isBlocked ? null : onClick}
        />
    )
}

const MoveSelectors = ({panelSize, directionSelectorSize, moveSelectorSize, selectorOffsetSize, allowedPositions, directionMap, isPanelLocked}) => {

    console.log(allowedPositions)

    const { moveSelectorDefaultColor, moveSelectorHoveredColor, moveSelectorSelectedColor, moveSelectorBlockedColor } = useControls('Selection Panel', {
        'Colors': folder({
            moveSelectorDefaultColor: '#00D2FF',
            moveSelectorHoveredColor: '#FF00D2',
            moveSelectorSelectedColor: '#D200FF',
            moveSelectorBlockedColor: '#FFD200'
        })
    })

    const handleMouseEnter = (e) => {
        // Change the color of the square when the mouse enters
        e.target.fill(moveSelectorHoveredColor);
        e.target.draw();
    };

    const handleMouseLeave = (e) => {
        // Change the color back when the mouse leaves
        e.target.fill(moveSelectorDefaultColor);
        e.target.draw();
    };

    const handleClick = (e) => {
        // Do something when the square is clicked
        e.target.fill(moveSelectorSelectedColor);
        e.target.draw();

        console.log(e.target.name())
    };

    return (

        <Layer>
            {[...Array(3)].map((_, i) => (
            [...Array(3)].map((_, j) => {
                
                const [xOffset, yOffset] = [i - 1, j - 1]
                const relativePosition = getRelativePosition(xOffset, yOffset, directionMap)
                const isPositionAllowed = checkIfPositionInArray(relativePosition, allowedPositions) && !isPanelLocked

                return (
                    <MoveSelector
                        name={`${relativePosition}`}
                        key={`${i}-${j}`}
                        x={i * moveSelectorSize + directionSelectorSize + (i + 1) *selectorOffsetSize}
                        y={j * moveSelectorSize + directionSelectorSize + (j + 1) *selectorOffsetSize}
                        width={moveSelectorSize}
                        height={moveSelectorSize}
                        fill={isPositionAllowed ? moveSelectorDefaultColor : moveSelectorBlockedColor}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleClick}
                        isBlocked={!isPositionAllowed}
                    />
                )
            })
            ))}
        </Layer>

    );
};

export default MoveSelectors;