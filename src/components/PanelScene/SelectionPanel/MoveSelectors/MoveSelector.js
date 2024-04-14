import React from 'react';
import { Rect } from 'react-konva';

const MoveSelector = (props) => {

    const { x, y, width, height, fill, onMouseEnter, onMouseLeave, onClick, isBlocked, name} = props
    
    // If the selector is blocked, it should be semi-transparent and non-interactive.
    const opacity = isBlocked ? 0.4 : 0.9;
    const eventHandlers = isBlocked ? {} : { onMouseEnter, onMouseLeave, onClick };

    return (
        <Rect
            name={name}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={fill}
            opacity={opacity}
            cornerRadius={3}
            {...eventHandlers}
        />
    )
}

export default MoveSelector;