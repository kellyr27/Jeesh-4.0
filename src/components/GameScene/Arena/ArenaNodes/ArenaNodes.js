import React, { useState, useEffect, useReducer } from 'react'
import ArenaNode from './ArenaNode';
import { ARENA_LENGTH } from '../../../../globals';
import { getAllAttackedPositionsKeys } from '../../../../utils/displayHelpers';

const initialState = [];
for (let x = 0; x < ARENA_LENGTH; x++) {
    for (let y = 0; y < ARENA_LENGTH; y++) {
        for (let z = 0; z < ARENA_LENGTH; z++) {
            initialState.push({
                key: `${x}-${y}-${z}`,
                position: [x, y, z],
                color: 'blue',
                opacity: 0.1,
                isDisplay: true
            });
        }
    }
}

function reducer(state, action) {
    switch (action.type) {
        case 'CHANGE_NODE':
            return state.map(node =>
                node.key === action.key
                    ? { ...node, color: action.color, opacity: action.opacity, isDisplay: action.isDisplay}
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
    soldier1Direction,
    setSoldier1Direction,
    movingModeDeactivate,
    
    soldiers
}) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    // Example of how to change a node
    useEffect(() => {
        // dispatch({ type: 'CHANGE_NODE', key: '0-1-0', color: 'red', opacity: 0.5 });


        const [positionsAttackedOnceKeys, positionsAttackedMultipleKeys] = getAllAttackedPositionsKeys(soldiers)

        for (const node of state) {
            if (positionsAttackedOnceKeys.includes(node.key)) {
                dispatch({ type: 'CHANGE_NODE', key: node.key, color: 'red', opacity: 0.1, isDisplay: true});
            } else if (positionsAttackedMultipleKeys.includes(node.key)) {
                dispatch({ type: 'CHANGE_NODE', key: node.key, color: 'blue', opacity: 0.1, isDisplay: true });
            } else {
                dispatch({ type: 'CHANGE_NODE', key: node.key, color: 'green', opacity: 0.001, isDisplay: false });
            }
        }

        // dispatch({ type: 'CHANGE_NODE', key: `${key}`, color: 'red', opacity: 0.5 });


    }, [soldiers, state]);

    return (
        <>
            {state.map(node => {
                return (
                    node.isDisplay && (
                      <ArenaNode
                        key={node.key}
                        position={node.position}
                        color={node.color}
                        opacity={node.opacity}
                      />
                    )
                  );
            })}
        </>
    )
}

export default ArenaNodes;