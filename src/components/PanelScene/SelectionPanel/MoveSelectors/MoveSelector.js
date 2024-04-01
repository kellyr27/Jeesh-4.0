import React from 'react';
import { Rect } from 'react-konva';

const MoveSelector = ({ x, y, width, height, fill, onMouseEnter, onMouseLeave, onClick, isBlocked, name}) => {

    
    return (
        <Rect
            name={name}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={fill}
            opacity={isBlocked ? 0.4 : 0.9}
            onMouseEnter={isBlocked ? null : onMouseEnter}
            onMouseLeave={isBlocked ? null : onMouseLeave}
            onClick={isBlocked ? null : onClick}
        />
    )
}

export default MoveSelector;