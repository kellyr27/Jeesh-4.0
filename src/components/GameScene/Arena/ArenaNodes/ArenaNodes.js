import React, { useState, useEffect, useReducer } from 'react'
import ArenaNode from './ArenaNode';
import { ARENA_LENGTH } from '../../../../globals';
import { getAttackedPositions } from '../../../../utils/displayHelpers';

const initialState = [];
for (let x = 0; x < ARENA_LENGTH; x++) {
    for (let y = 0; y < ARENA_LENGTH; y++) {
        for (let z = 0; z < ARENA_LENGTH; z++) {
            initialState.push({
                key: `${x}-${y}-${z}`,
                position: [x, y, z],
                color: 'blue',
                opacity: 0.1
            });
        }
    }
}

function reducer(state, action) {
    switch (action.type) {
        case 'CHANGE_NODE':
            return state.map(node =>
                node.key === action.key
                    ? { ...node, color: action.color, opacity: action.opacity }
                    : node
            );
        default:
            throw new Error();
    }
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
    soldier1Position,
    setSoldier1Position,
    movingMode,
    soldier1Direction,
    setSoldier1Direction,
}) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    // Example of how to change a node
    useEffect(() => {
        // dispatch({ type: 'CHANGE_NODE', key: '0-1-0', color: 'red', opacity: 0.5 });


        if (!movingMode) {

            // Get attacked positions
            const attackedPositions = getAttackedPositions(soldier1Position, soldier1Direction);

            // Round the attacked Positions to the nearest integer
            const attackedPositionsKeys = attackedPositions.map(pos => pos.map(Math.round).join('-'));

            // console.log(attackedPositionsKeys)
            for (const node of state) {
                if (attackedPositionsKeys.includes(node.key)) {
                    dispatch({ type: 'CHANGE_NODE', key: node.key, color: 'red', opacity: 0.5 });
                } else {
                    dispatch({ type: 'CHANGE_NODE', key: node.key, color: 'blue', opacity: 0.1 });
                }
            }

            // dispatch({ type: 'CHANGE_NODE', key: `${key}`, color: 'red', opacity: 0.5 });

        }

    }, [movingMode]);

    return (
        <>
            {state.map(node => (
                <ArenaNode
                    key={node.key}
                    position={node.position}
                    color={node.color}
                    opacity={node.opacity}
                />
            ))}
        </>
    )
}

export default ArenaNodes;