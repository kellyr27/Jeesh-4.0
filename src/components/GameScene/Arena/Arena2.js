import React, {useState, useEffect} from "react";
import { useControls, folder } from 'leva';
import ArenaNode from "./ArenaNodes/ArenaNode";
import { getAllAttackedPositionsKeys, checkIfInArena, getEdgeEndPoints } from '../../../utils/displayHelpers';
import { addArrays } from "../../../utils/arrayHelpers";
import ArenaEdge from "./ArenaEdges/ArenaEdges";

const arrayToKey = (array) => {
    return array.join('_')
}

const keyToArray = (key) => {
    return key.split('_').map(Number)
}

const getAttackZoneEdges = (attackedPositions) => {
    const attackZoneEdges = []
    
    attackedPositions.forEach((position) => {
        const adjacentEdgePairs = []

        for (let i = -1; i <= 1; i += 2) {
            for (let j = -1; j <= 1; j += 2) {

                const arrayPosition = keyToArray(position)

                const pairs = [
                    [
                        [
                            arrayPosition,
                            addArrays(keyToArray(position), [i, j, 0])
                        ],
                        [
                            addArrays(keyToArray(position), [i, 0, 0]),
                            addArrays(keyToArray(position), [0, j, 0])
                        ]
                    ], 
                    [
                        [
                            arrayPosition,
                            addArrays(keyToArray(position), [i, 0, j])
                        ],
                        [
                            addArrays(keyToArray(position), [i, 0, 0]),
                            addArrays(keyToArray(position), [0, 0, j])
                        ]
                    ],
                    [
                        [
                            arrayPosition,
                            addArrays(keyToArray(position), [0, i, j])
                        ],
                        [
                            addArrays(keyToArray(position), [0, i, 0]),
                            addArrays(keyToArray(position), [0, 0, j])
                        ]
                    ]
                ]

                adjacentEdgePairs.push(...pairs)

            }
        }

        adjacentEdgePairs.forEach((edgePair) => {

            const isNode1Edge1InAttackedPositions = attackedPositions.includes(arrayToKey(edgePair[0][0]))
            const isNode2Edge1InAttackedPositions = attackedPositions.includes(arrayToKey(edgePair[0][1]))
            const isNode1Edge2InAttackedPositions = attackedPositions.includes(arrayToKey(edgePair[1][0]))
            const isNode2Edge2InAttackedPositions = attackedPositions.includes(arrayToKey(edgePair[1][1]))

            // Count the number of true values
            const trueCount = [
                isNode1Edge1InAttackedPositions, 
                isNode2Edge1InAttackedPositions, 
                isNode1Edge2InAttackedPositions, 
                isNode2Edge2InAttackedPositions
            ].filter(Boolean).length

            if (trueCount === 1 || trueCount === 3) {
                attackZoneEdges.push(
                    [
                        arrayToKey(edgePair[0][0]),
                        arrayToKey(edgePair[0][1])
                    ]
                )
            }
        })
    })

    return attackZoneEdges
}


const Arena2 = ({
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
                'Hovered': 'yellow',
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
                'Attack Zone': 'black',
                'Border': 'white',
                'Hovered': 'yellow',
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
                'Hovered': 0.3,
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
                'Default': 1,
                'Attack Zone': 1,
                'Border': 1,
                'Hovered': 1,
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
                'Default': false,
                'Attack Zone': true,
                'Border': true,
                'Hovered': true,
            })
        })
    })
    const arenaEdgesIsDisplay = {
        default: arenaEdgesDefaultIsDisplay,
        attackZone: arenaEdgesAttackZoneIsDisplay,
        border: arenaEdgesBorderIsDisplay,
        hovered: arenaEdgesHoveredIsDisplay
    }

    const {
        'Default': arenaEdgesDefaultLineWidth,
        'Attack Zone': arenaEdgesAttackZoneLineWidth,
        'Border': arenaEdgesBorderLineWidth,
        'Hovered': arenaEdgesHoveredLineWidth,
    } = useControls('Arena', {
        'Arena Edges': folder({
            'Is Display': folder({
                'Default': 1,
                'Attack Zone': 8,
                'Border': 1,
                'Hovered': 1,
            })
        })
    })
    const arenaEdgesLineWidth = {
        default: arenaEdgesDefaultLineWidth,
        attackZone: arenaEdgesAttackZoneLineWidth,
        border: arenaEdgesBorderLineWidth,
        hovered: arenaEdgesHoveredLineWidth
    }

    const [attackedOnceNodes, setAttackedOnceNodes] = useState([])
    const [attackedTwiceNodes, setAttackedTwiceNodes] = useState([])
    const [attackZoneEdges, setAttackZoneEdges] = useState([])


    useEffect(() => {
        const [positionsAttackedOnceKeys, positionsAttackedMultipleKeys] = getAllAttackedPositionsKeys(soldiers)

        setAttackedOnceNodes(positionsAttackedOnceKeys)
        setAttackedTwiceNodes(positionsAttackedMultipleKeys)

    }, [soldiers])


    useEffect(() => {
        const attackZoneNodes = [...attackedOnceNodes, ...attackedTwiceNodes]

        const edgeNodes = getAttackZoneEdges(attackZoneNodes)

        setAttackZoneEdges(edgeNodes)

        console.log('attackZoneEdges', edgeNodes)

    }, [attackedOnceNodes, attackedTwiceNodes])

    return (
        <>
            {attackedOnceNodes.map((node, index) => {
                // Extract position from key
                const position = node.split('_').map(Number);

                return (
                    <ArenaNode
                        key={index}
                        position={position}
                        color={arenaNodesColors.attackZoneSingle}
                        opacity={arenaNodesOpacity.attackZoneSingle}
                        isDisplay={arenaNodesIsDisplay.attackZoneSingle}
                    />
                );
            })}
            {attackedTwiceNodes.map((node, index) => {
                // Extract position from key
                const position = node.split('_').map(Number);

                return (
                    <ArenaNode
                        key={index}
                        position={position}
                        color={arenaNodesColors.attackZoneShared}
                        opacity={arenaNodesOpacity.attackZoneShared}
                        isDisplay={arenaNodesIsDisplay.attackZoneShared}
                    />
                );
            })}
            {attackZoneEdges.map((edge, index) => {
                const points = getEdgeEndPoints(keyToArray(edge[0]), keyToArray(edge[1]))
                
                return (
                    <ArenaEdge
                        key={index}
                        points={points}
                        color={arenaEdgesColors.attackZone}
                        linewidth={6}
                        opacity={arenaEdgesOpacity.attackZone}
                        isDisplay={arenaEdgesIsDisplay.attackZone}
                    />
                )
            })}
        </>
    )
}

export default Arena2;
