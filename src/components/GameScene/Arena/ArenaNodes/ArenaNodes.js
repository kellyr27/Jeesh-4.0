import React, { useState, useEffect } from 'react'
import ArenaNode from './ArenaNode';

// Function to generate random color
const randomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

//TODO: Consider useReducer for this component
const ArenaNodes = ({
    defaultColor,
    attackZoneArmy1Color,
    attackZoneArmy2Color,
    attackZoneSharedColor,
    doorColor,
    hoveredColor,
    defaultOpacity,
    attackZoneArmy1Opacity,
    attackZoneArmy2Opacity,
    attackZoneSharedOpacity,
    doorOpacity,
    hoveredOpacity,
    defaultDisplay,
    attackZoneArmy1Display,
    attackZoneArmy2Display,
    attackZoneSharedDisplay,
    doorDisplay,
    hoveredDisplay,
}) => {

    const nodes = [];

    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            for (let z = -1; z < 2; z++) {
                nodes.push(
                    <ArenaNode
                        key={`${x}-${y}-${z}`}
                        position={[x, y, z]}
                        color={'blue'}
                        opacity={0.1}
                    />
                );
            }
        }
    }

    return (
        <>{nodes}</>
    )
}

export default ArenaNodes;