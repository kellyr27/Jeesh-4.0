import React, { useState, useEffect, useReducer, memo } from 'react'
import ArenaNode from './ArenaNode';
import {equalArrays} from "../../../../utils/arrayHelpers"

//TODO: Consider useReducer for this component
const ArenaNodes = memo(({
    arenaNodesColors,
    arenaNodesOpacity,
    arenaNodesIsDisplay,
    movingModeDeactivate,
    soldiers,
    state,
    currentHoveredPosition
 }) => {

    return (
        <>
            {state.map(node => {
                

                const isHovered = currentHoveredPosition ? equalArrays(node.position, currentHoveredPosition) : false;
                const color = isHovered ? arenaNodesColors['hovered'] : arenaNodesColors[node.state];
                const opacity = isHovered ? arenaNodesOpacity['hovered'] : arenaNodesOpacity[node.state];
                const isDisplay = isHovered ? arenaNodesIsDisplay['hovered'] : arenaNodesIsDisplay[node.state];
                
                return (
                    node.isInArena && isDisplay && (
                        <ArenaNode
                            key={node.key}
                            position={node.position}
                            color={color}
                            opacity={opacity}
                        />
                    )
                );
            })}
        </>
    );
})

export default ArenaNodes;