import React, { useState, useEffect, useReducer, memo } from 'react'
import ArenaNode from './ArenaNode';

//TODO: Consider useReducer for this component
const ArenaNodes = memo(({
    arenaNodesColors,
    arenaNodesOpacity,
    arenaNodesIsDisplay,
    movingModeDeactivate,
    soldiers,
    state
 }) => {

    console.log(arenaNodesColors[0])

    return (
        <>
            {state.map(node => {

                console.log(node)

                return (
                    node.isInArena && arenaNodesIsDisplay[node.state] && (
                        <ArenaNode
                            key={node.key}
                            position={node.position}
                            color={arenaNodesColors[node.state]}
                            opacity={arenaNodesOpacity[node.state]}
                        />
                    )
                );
            })}
        </>
    );
})

export default ArenaNodes;