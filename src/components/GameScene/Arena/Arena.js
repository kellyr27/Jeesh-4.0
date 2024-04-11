// import React, { useRef, useEffect, useReducer, useState } from 'react';
// import ArenaNodes from './ArenaNodes/ArenaNodes';
// import { useControls, folder } from 'leva';
// import ArenaEdge from './ArenaEdges/ArenaEdges';
// import { getAllAttackedPositionsKeys, checkIfInArena } from '../../../utils/displayHelpers';
// import { ARENA_LENGTH } from '../../../globals';
// import {equalArrays} from "../../../utils/arrayHelpers"
// import {getCubeEdgeConnections, getCubeEdgeConnections2} from "../../../utils/displayHelpers"
// import ArenaNode from './ArenaNodes/ArenaNode';
// /**
//  * Node States 
//  * 0 - Default
//  * 1 - Attack Zone - Single
//  * 2 - Attack Zone - Shared
//  */
// const initializeNodes = () => {
//     const initialState = [];
//     for (let x = -1; x < ARENA_LENGTH + 1; x++) {
//         for (let y = -1; y < ARENA_LENGTH + 1; y++) {
//             for (let z = -1; z < ARENA_LENGTH + 1; z++) {
//                 if (!checkIfInArena([x, y, z])) {
//                     initialState.push({
//                         key: `${x}-${y}-${z}`,
//                         position: [x, y, z],
//                         state: 0,
//                         isInArena: false
//                     });
//                 } else {
//                     initialState.push({
//                         key: `${x}-${y}-${z}`,
//                         position: [x, y, z],
//                         state: 0,
//                         isInArena: true
//                     });
//                 }
//             }
//         }
//     }

//     return initialState
// }

// function reducer(nodes, action) {
//     switch (action.type) {
//         case 'SET_DEFAULT':
//             return nodes.map(node =>
//                 node.key === action.key
//                     ? { ...node, state: 'Default' }
//                     : node
//             );
//         case 'SET_ATTACK_ZONE_SINGLE':
//             return nodes.map(node =>
//                 node.key === action.key
//                     ? { ...node, state: 'attackZoneSingle' }
//                     : node
//             );
//         case 'SET_ATTACK_ZONE_SHARED':
//             return nodes.map(node =>
//                 node.key === action.key
//                     ? { ...node, state: 'attackZoneShared' }
//                     : node
//             );
//         default:
//             throw new Error();
//     }
// }

// const Arena = ({
//     soldiers,
//     currentHoveredPose,
//     currentHoveredPosition
// }) => {


//     const {
//         'Default': arenaNodesDefaultColor,
//         'Attack Zone - Single': arenaNodesAttackZoneSingleColor,
//         'Attack Zone - Shared': arenaNodesAttackZoneSharedColor,
//         'Hovered': arenaNodesHoveredColor,
//     } = useControls('Arena', {
//         'Arena Nodes': folder({
//             'Colors': folder({
//                 'Default': '#ff0000',
//                 'Attack Zone - Single': 'red',
//                 'Attack Zone - Shared': 'blue',
//                 'Hovered': 'yellow',
//             })
//         })
//     })
//     const arenaNodesColors = {
//         default: arenaNodesDefaultColor,
//         attackZoneSingle: arenaNodesAttackZoneSingleColor,
//         attackZoneShared: arenaNodesAttackZoneSharedColor,
//         hovered: arenaNodesHoveredColor
//     }

//     const {
//         'Default': arenaEdgesDefaultColor,
//         'Attack Zone': arenaEdgesAttackZoneColor,
//         'Border': arenaEdgesBorderColor,
//         'Hovered': arenaEdgesHoveredColor,
//     } = useControls('Arena', {
//         'Arena Edges': folder({
//             'Colors': folder({
//                 'Default': '#ff0000',
//                 'Attack Zone': 'red',
//                 'Border': 'white',
//                 'Hovered': 'yellow',
//             })
//         })
//     })
//     const arenaEdgesColors = {
//         default: arenaEdgesDefaultColor,
//         attackZone: arenaEdgesAttackZoneColor,
//         border: arenaEdgesBorderColor,
//         hovered: arenaEdgesHoveredColor
//     }



//     const {
//         'Default': arenaNodesDefaultOpacity,
//         'Attack Zone - Single': arenaNodesAttackZoneSingleOpacity,
//         'Attack Zone - Shared': arenaNodesAttackZoneSharedOpacity,
//         'Hovered': arenaNodesHoveredOpacity,
//     } = useControls('Arena', {
//         'Arena Nodes': folder({
//             'Opacities': folder({
//                 'Default': 0.01,
//                 'Attack Zone - Single': 0.35,
//                 'Attack Zone - Shared': 0.35,
//                 'Hovered': 0.3,
//             })
//         })
//     })
//     const arenaNodesOpacity = {
//         default: arenaNodesDefaultOpacity,
//         attackZoneSingle: arenaNodesAttackZoneSingleOpacity,
//         attackZoneShared: arenaNodesAttackZoneSharedOpacity,
//         hovered: arenaNodesHoveredOpacity
//     }

//     const {
//         'Default': arenaEdgesDefaultOpacity,
//         'Attack Zone': arenaEdgesAttackZoneOpacity,
//         'Border': arenaEdgesBorderOpacity,
//         'Hovered': arenaEdgesHoveredOpacity,
//     } = useControls('Arena', {
//         'Arena Edges': folder({
//             'Opacity': folder({
//                 'Default': 1,
//                 'Attack Zone': 1,
//                 'Border': 1,
//                 'Hovered': 1,
//             })
//         })
//     })
//     const arenaEdgesOpacity = {
//         default: arenaEdgesDefaultOpacity,
//         attackZone: arenaEdgesAttackZoneOpacity,
//         border: arenaEdgesBorderOpacity,
//         hovered: arenaEdgesHoveredOpacity
//     }

    
//     const {
//         'Default': arenaNodesDefaultIsDisplay,
//         'Attack Zone - Single': arenaNodesAttackZoneSingleIsDisplay,
//         'Attack Zone - Shared': arenaNodesAttackZoneSharedIsDisplay,
//         'Hovered': arenaNodesHoveredIsDisplay,
//     } = useControls('Arena', {
//         'Arena Nodes': folder({
//             'Is Display': folder({
//                 'Default': false,
//                 'Attack Zone - Single': true,
//                 'Attack Zone - Shared': true,
//                 'Hovered': true,
//             })
//         })
//     })
//     const arenaNodesIsDisplay = {
//         default: arenaNodesDefaultIsDisplay,
//         attackZoneSingle: arenaNodesAttackZoneSingleIsDisplay,
//         attackZoneShared: arenaNodesAttackZoneSharedIsDisplay,
//         hovered: arenaNodesHoveredIsDisplay
//     }

//     const {
//         'Default': arenaEdgesDefaultIsDisplay,
//         'Attack Zone': arenaEdgesAttackZoneIsDisplay,
//         'Border': arenaEdgesBorderIsDisplay,
//         'Hovered': arenaEdgesHoveredIsDisplay,
//     } = useControls('Arena', {
//         'Arena Edges': folder({
//             'Is Display': folder({
//                 'Default': false,
//                 'Attack Zone': true,
//                 'Border': true,
//                 'Hovered': true,
//             })
//         })
//     })
//     const arenaEdgesIsDisplay = {
//         default: arenaEdgesDefaultIsDisplay,
//         attackZone: arenaEdgesAttackZoneIsDisplay,
//         border: arenaEdgesBorderIsDisplay,
//         hovered: arenaEdgesHoveredIsDisplay
//     }

//     const {
//         'Default': arenaEdgesDefaultLineWidth,
//         'Attack Zone': arenaEdgesAttackZoneLineWidth,
//         'Border': arenaEdgesBorderLineWidth,
//         'Hovered': arenaEdgesHoveredLineWidth,
//     } = useControls('Arena', {
//         'Arena Edges': folder({
//             'Is Display': folder({
//                 'Default': 1,
//                 'Attack Zone': 1,
//                 'Border': 1,
//                 'Hovered': 1,
//             })
//         })
//     })
//     const arenaEdgesLineWidth = {
//         default: arenaEdgesDefaultLineWidth,
//         attackZone: arenaEdgesAttackZoneLineWidth,
//         border: arenaEdgesBorderLineWidth,
//         hovered: arenaEdgesHoveredLineWidth
//     }

//     const [nodes, dispatch] = useReducer(reducer, initializeNodes());
//     const edges = useRef(getCubeEdgeConnections2(nodes));

//     useEffect(() => {
        
//         /**
//          * Returns two sets of positions
//          */
//         // const [positionsAttackedOnceKeys, positionsAttackedMultipleKeys] = getAllAttackedPositionsKeys(soldiers)

//         // for (const node of nodes) {
//         //     if (positionsAttackedOnceKeys.has(node.key)) {
//         //         dispatch({ 
//         //             type: 'SET_ATTACK_ZONE_SINGLE', 
//         //             key: node.key, 
//         //         })
//         //     } else if (positionsAttackedMultipleKeys.has(node.key)) {
//         //         dispatch({ 
//         //             type: 'SET_ATTACK_ZONE_SHARED', 
//         //             key: node.key, 
//         //         });
//         //     } else {
//         //         dispatch({ 
//         //             type: 'SET_DEFAULT', 
//         //             key: node.key, 
//         //         });
//         //     }
//         // }

//         const [positionsAttackedOnceKeys, positionsAttackedMultipleKeys] = getAllAttackedPositionsKeys(soldiers)

//         const nodesMap = new Map(nodes.map(node => [node.key, node]));

//         for (const key of positionsAttackedOnceKeys) {
//             if (nodesMap.has(key)) {
//                 dispatch({ 
//                     type: 'SET_ATTACK_ZONE_SINGLE', 
//                     key: key, 
//                 });
//             }
//         }

//         for (const key of positionsAttackedMultipleKeys) {
//             if (nodesMap.has(key)) {
//                 dispatch({ 
//                     type: 'SET_ATTACK_ZONE_SHARED', 
//                     key: key, 
//                 });
//             }
//         }

//         for (const node of nodes) {
//             if (!positionsAttackedOnceKeys.has(node.key) && !positionsAttackedMultipleKeys.has(node.key)) {
//                 dispatch({ 
//                     type: 'SET_DEFAULT', 
//                     key: node.key, 
//                 });
//             }
//         }

//     }, [soldiers, 
//         nodes
//     ]);

//     return (
//         <>
//             {/* <ArenaNode
//                 arenaNodesColors={arenaNodesColors}
//                 arenaNodesOpacity={arenaNodesOpacity}
//                 arenaNodesIsDisplay={arenaNodesIsDisplay}
//                 soldiers={soldiers}
//                 nodes={nodes}
//                 currentHoveredPosition={currentHoveredPosition}
//             /> */}
//             {nodes.length > 0 && nodes.map((node, index) => {
                
//                 // Check if the node is hovered over
//                 const isHovered = currentHoveredPosition ? equalArrays(node.position, currentHoveredPosition) : false;
//                 const isDiplay = isHovered ? arenaNodesIsDisplay['hovered'] : arenaNodesIsDisplay[node.state]
//                 return (
//                     isDiplay && (
//                         <ArenaNode 
//                             position={node.position}
//                             color={isHovered ? arenaNodesColors['hovered'] : arenaNodesColors[node.state]}
//                             opacity={isHovered ? arenaNodesOpacity['hovered'] : arenaNodesOpacity[node.state]}
//                         />
//                     )
//                 )

//             })}
//             {/* {edges.length > 0 && edges.map((edge, index) => {

//                 console.log(edge)

//                 return (
//                     <ArenaEdge
//                     />
//                 )
//             })} */}
//     </>

//     );
// };

// export default Arena;