import React, { useRef, useEffect, useReducer, useState } from 'react';
import ArenaNodes from './ArenaNodes/ArenaNodes';
import { useControls, folder } from 'leva';
import ArenaEdges from './ArenaEdges/ArenaEdges';
import { getAllAttackedPositionsKeys, checkIfInArena } from '../../../utils/displayHelpers';
import { ARENA_LENGTH } from '../../../globals';
import {equalArrays} from "../../../utils/arrayHelpers"
import {getCubeEdgeConnections, getCubeEdgeConnections2} from "../../../utils/displayHelpers"

/**
 * Node States 
 * 0 - Default
 * 1 - Attack Zone - Single
 * 2 - Attack Zone - Shared
 */
const initializeNodes = () => {
    const initialState = [];
    for (let x = -1; x < ARENA_LENGTH + 1; x++) {
        for (let y = -1; y < ARENA_LENGTH + 1; y++) {
            for (let z = -1; z < ARENA_LENGTH + 1; z++) {
                if (!checkIfInArena([x, y, z])) {
                    initialState.push({
                        key: `${x}-${y}-${z}`,
                        position: [x, y, z],
                        state: 0,
                        isInArena: false
                    });
                } else {
                    initialState.push({
                        key: `${x}-${y}-${z}`,
                        position: [x, y, z],
                        state: 0,
                        isInArena: true
                    });
                }
            }
        }
    }

    return initialState
}

function reducer(state, action) {
    switch (action.type) {
        case 'SET_DEFAULT':
            return state.map(node =>
                node.key === action.key
                    ? { ...node, state: 'Default' }
                    : node
            );
        case 'SET_ATTACK_ZONE_SINGLE':
            return state.map(node =>
                node.key === action.key
                    ? { ...node, state: 'attackZoneSingle' }
                    : node
            );
        case 'SET_ATTACK_ZONE_SHARED':
            return state.map(node =>
                node.key === action.key
                    ? { ...node, state: 'attackZoneShared' }
                    : node
            );
        default:
            throw new Error();
    }
}

const Arena = ({
    soldiers
}) => {

    const {
        'Default': arenaNodesDefaultColor,
        'Attack Zone - Single': arenaNodesAttackZoneSingleColor,
        'Attack Zone - Shared': arenaNodesAttackZoneSharedColor,
        'Hovered': arenaNodesHoveredColor,
    } = useControls('Arena', {
        'Arena Nodes': folder({
            'Colors': folder({
                'Default': '#ff0000',
                'Attack Zone - Single': 'red',
                'Attack Zone - Shared': 'blue',
                'Hovered': '#ffffff',
            })
        })
    })
    const arenaNodesColors = {
        default: arenaNodesDefaultColor,
        attackZoneSingle: arenaNodesAttackZoneSingleColor,
        attackZoneShared: arenaNodesAttackZoneSharedColor,
        hovered: arenaNodesHoveredColor
    }

    const {
        'Default': arenaEdgesDefaultColor,
        'Attack Zone': arenaEdgesAttackZoneColor,
        'Border': arenaEdgesBorderColor,
        'Hovered': arenaEdgesHoveredColor,
    } = useControls('Arena', {
        'Arena Edges': folder({
            'Colors': folder({
                'Default': '#ff0000',
                'Attack Zone': 'red',
                'Border': 'white',
                'Hovered': '#ffffff',
            })
        })
    })
    const arenaEdgesColors = {
        default: arenaEdgesDefaultColor,
        attackZone: arenaEdgesAttackZoneColor,
        border: arenaEdgesBorderColor,
        hovered: arenaEdgesHoveredColor
    }



    const {
        'Default': arenaNodesDefaultOpacity,
        'Attack Zone - Single': arenaNodesAttackZoneSingleOpacity,
        'Attack Zone - Shared': arenaNodesAttackZoneSharedOpacity,
        'Hovered': arenaNodesHoveredOpacity,
    } = useControls('Arena', {
        'Arena Nodes': folder({
            'Opacities': folder({
                'Default': 0.01,
                'Attack Zone - Single': 0.35,
                'Attack Zone - Shared': 0.35,
                'Hovered': 0.1,
            })
        })
    })
    const arenaNodesOpacity = {
        default: arenaNodesDefaultOpacity,
        attackZoneSingle: arenaNodesAttackZoneSingleOpacity,
        attackZoneShared: arenaNodesAttackZoneSharedOpacity,
        hovered: arenaNodesHoveredOpacity
    }

    const {
        'Default': arenaEdgesDefaultOpacity,
        'Attack Zone': arenaEdgesAttackZoneOpacity,
        'Border': arenaEdgesBorderOpacity,
        'Hovered': arenaEdgesHoveredOpacity,
    } = useControls('Arena', {
        'Arena Edges': folder({
            'Opacity': folder({
                'Default': '#ff0000',
                'Attack Zone': 'red',
                'Border': 'white',
                'Hovered': '#ffffff',
            })
        })
    })
    const arenaEdgesOpacity = {
        default: arenaEdgesDefaultOpacity,
        attackZone: arenaEdgesAttackZoneOpacity,
        border: arenaEdgesBorderOpacity,
        hovered: arenaEdgesHoveredOpacity
    }

    
    const {
        'Default': arenaNodesDefaultIsDisplay,
        'Attack Zone - Single': arenaNodesAttackZoneSingleIsDisplay,
        'Attack Zone - Shared': arenaNodesAttackZoneSharedIsDisplay,
        'Hovered': arenaNodesHoveredIsDisplay,
    } = useControls('Arena', {
        'Arena Nodes': folder({
            'Is Display': folder({
                'Default': false,
                'Attack Zone - Single': true,
                'Attack Zone - Shared': true,
                'Hovered': true,
            })
        })
    })
    const arenaNodesIsDisplay = {
        default: arenaNodesDefaultIsDisplay,
        attackZoneSingle: arenaNodesAttackZoneSingleIsDisplay,
        attackZoneShared: arenaNodesAttackZoneSharedIsDisplay,
        hovered: arenaNodesHoveredIsDisplay
    }

    const {
        'Default': arenaEdgesDefaultIsDisplay,
        'Attack Zone': arenaEdgesAttackZoneIsDisplay,
        'Border': arenaEdgesBorderIsDisplay,
        'Hovered': arenaEdgesHoveredIsDisplay,
    } = useControls('Arena', {
        'Arena Edges': folder({
            'Is Display': folder({
                'Default': '#ff0000',
                'Attack Zone': 'red',
                'Border': 'white',
                'Hovered': '#ffffff',
            })
        })
    })
    const arenaEdgesIsDisplay = {
        default: arenaEdgesDefaultIsDisplay,
        attackZone: arenaEdgesAttackZoneIsDisplay,
        border: arenaEdgesBorderIsDisplay,
        hovered: arenaEdgesHoveredIsDisplay
    }

    const [state, dispatch] = useReducer(reducer, initializeNodes());

    // useState(() => {

    //     console.log(getCubeEdgeConnections2(state))

    // }, [state])

    // useEffect(() => {
  
    //     const [positionsAttackedOnceKeys, positionsAttackedMultipleKeys] = getAllAttackedPositionsKeys(soldiers)

    //     for (const node of state) {
    //         if (positionsAttackedOnceKeys.includes(node.key)) {
    //             dispatch({ 
    //                 type: 'SET_ATTACK_ZONE_SINGLE', 
    //                 key: node.key, 
    //             })
    //         } else if (positionsAttackedMultipleKeys.includes(node.key)) {
    //             dispatch({ 
    //                 type: 'SET_ATTACK_ZONE_SHARED', 
    //                 key: node.key, 
    //             });
    //         } else {
    //             dispatch({ 
    //                 type: 'SET_DEFAULT', 
    //                 key: node.key, 
    //             });
    //         }
    //     }

    // }, [soldiers, 
    //     state
    // ]);



    return (
        <>
            <ArenaNodes
                arenaNodesColors={arenaNodesColors}
                arenaNodesOpacity={arenaNodesOpacity}
                arenaNodesIsDisplay={arenaNodesIsDisplay}
                soldiers={soldiers}
                state={state}
            />
            {/* {state.length > 0 && getCubeEdgeConnections2(state).map((edge, index) => {

                return (
                    <ArenaEdges
                        key={index}
                        edge={edge}
                    />
                )
            })} */}
    </>

    );
};

export default Arena;