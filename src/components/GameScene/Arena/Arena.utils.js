import { addArrays, equalArrays } from "../../../utils/arrayHelpers"
import { checkIfInArena } from "../../../utils/displayHelpers"
import { equalDirections } from "../../../utils/directionHelpers"
import {ARENA_LENGTH} from "../../../globals"

const arrayToKey = (array) => {
    return array.join('_')
}

const keyToArray = (key) => {
    return key.split('_').map(Number)
}

/**
 * This function calculates the edges of a 3D grid that are adjacent to a given set of positions.
 * It takes as input an array of position keys, where each key is a string representation of a 3D coordinate.
 * For each position, it calculates the adjacent edges in all three dimensions (x, y, z).
 * An edge is considered adjacent if it shares at least one vertex with the position.
 * The function then checks if each end of the edge is in the set of input positions.
 * If exactly one or three ends are in the set, the edge is added to the output.
 * The function returns an array of edges, where each edge is represented by a pair of position keys.
 *
 * @param {Array<string>} positionKeys - An array of position keys representing the positions to calculate adjacent edges for.
 * @returns {Array<Array<string>>} - An array of edges adjacent to the input positions.
 */
const getEdgesFromPositionKeys = (positionKeys) => {
    const edges = []
    
    positionKeys.forEach((positionKey) => {
        const adjacentEdgePairs = []

        for (let i = -1; i <= 1; i += 2) {
            for (let j = -1; j <= 1; j += 2) {

                const arrayPosition = keyToArray(positionKey)

                const pairs = [
                    [
                        [
                            arrayPosition,
                            addArrays(keyToArray(positionKey), [i, j, 0])
                        ],
                        [
                            addArrays(keyToArray(positionKey), [i, 0, 0]),
                            addArrays(keyToArray(positionKey), [0, j, 0])
                        ]
                    ], 
                    [
                        [
                            arrayPosition,
                            addArrays(keyToArray(positionKey), [i, 0, j])
                        ],
                        [
                            addArrays(keyToArray(positionKey), [i, 0, 0]),
                            addArrays(keyToArray(positionKey), [0, 0, j])
                        ]
                    ],
                    [
                        [
                            arrayPosition,
                            addArrays(keyToArray(positionKey), [0, i, j])
                        ],
                        [
                            addArrays(keyToArray(positionKey), [0, i, 0]),
                            addArrays(keyToArray(positionKey), [0, 0, j])
                        ]
                    ]
                ]

                adjacentEdgePairs.push(...pairs)

            }
        }

        adjacentEdgePairs.forEach((edgePair) => {

            const isNode1Edge1InAttackedPositions = positionKeys.includes(arrayToKey(edgePair[0][0]))
            const isNode2Edge1InAttackedPositions = positionKeys.includes(arrayToKey(edgePair[0][1]))
            const isNode1Edge2InAttackedPositions = positionKeys.includes(arrayToKey(edgePair[1][0]))
            const isNode2Edge2InAttackedPositions = positionKeys.includes(arrayToKey(edgePair[1][1]))

            // Count the number of true values
            const trueCount = [
                isNode1Edge1InAttackedPositions, 
                isNode2Edge1InAttackedPositions, 
                isNode1Edge2InAttackedPositions, 
                isNode2Edge2InAttackedPositions
            ].filter(Boolean).length

            if (trueCount === 1 || trueCount === 3) {
                edges.push(
                    [
                        arrayToKey(edgePair[0][0]),
                        arrayToKey(edgePair[0][1])
                    ]
                )
            }
        })
    })

    return edges
}

/**
 * This function calculates the positions that would be attacked by all soldiers in a given list.
 * It counts how many times each position is attacked, and separates the positions into two lists:
 * one for positions attacked only once, and one for positions attacked multiple times.
 *
 * @param {Array<Object>} soldiers - An array of soldier objects, each containing a 'gamePosition' property and a 'direction' property.
 * @returns {Array<Array<string>>} - An array containing two lists of positions: one for positions attacked only once, and one for positions attacked multiple times.
 */
const getAttackedPositions = (position, direction) => {

    let attackedPositions = []

    // Get all positions around the soldier
    for (let i = position[0] - 1; i <= position[0] + 1; i++) {
        for (let j = position[1] - 1; j <= position[1] + 1; j++) {
            for (let k = position[2] - 1; k <= position[2] + 1; k++) {
                attackedPositions.push([i,j,k])
            }
        }
    }

    // Offset Attacked Coords to match direction
    if (equalDirections(direction, '+x')) {
        attackedPositions = attackedPositions.map((position) => {
            return [position[0] + 2, position[1], position[2]]
        })
    } else if (equalDirections(direction, '-x')) {
        attackedPositions = attackedPositions.map((position) => {
            return [position[0] - 2, position[1], position[2]]
        })
    } else if (equalDirections(direction, '+y')) {
        attackedPositions = attackedPositions.map((position) => {
            return [position[0], position[1] + 2, position[2]]
        })
    } else if (equalDirections(direction, '-y')) {
        attackedPositions = attackedPositions.map((position) => {
            return [position[0], position[1] - 2, position[2]]
        })
    } else if (equalDirections(direction, '+z')) {
        attackedPositions = attackedPositions.map((position) => {
            return [position[0], position[1], position[2] + 2]
        })
    } else if (equalDirections(direction, '-z')) {
        attackedPositions = attackedPositions.map((position) => {
            return [position[0], position[1], position[2] - 2]
        })
    }

    // Filter out positions that are not in the arena
    attackedPositions = attackedPositions.filter((position) => {
        return checkIfInArena(position)
    })

    return attackedPositions
}

const getAllAttackedPositionsKeys = (soldiers) => {
    // Count of how many times a position is attacked
    let attackedPositionsCount = new Map()
    for (const soldier of soldiers) {
        const attackedPositions = getAttackedPositions(soldier.gamePosition, soldier.direction)

        attackedPositions.forEach((position) => {

            const positionKey = arrayToKey(position);
            const count = attackedPositionsCount.get(positionKey);

            if (count !== undefined) {
                attackedPositionsCount.set(positionKey, count + 1);
            } else {
                attackedPositionsCount.set(positionKey, 1);
            }
        })
    }

    // Return two lists, the first one with positions only attacked once, another with positions attacked more than once
    const attackedOnce = []
    const attackedMultiple = []
    for (const [stringPosition, count] of attackedPositionsCount) {
        if (count === 1) {
            attackedOnce.push(stringPosition)
        } else {
            attackedMultiple.push(stringPosition)
        }
    }
    return [attackedOnce, attackedMultiple]
}

/**
 * Get the Edge end points from two nodes
 */
const getEdgeEndPoints = (node1Position, node2Position) => {

    const [node1PositionX, node1PositionY, node1PositionZ] = node1Position
    const [node2PositionX, node2PositionY, node2PositionZ] = node2Position

    const avgX = (node1PositionX + node2PositionX) / 2
    const avgY = (node1PositionY + node2PositionY) / 2
    const avgZ = (node1PositionZ + node2PositionZ) / 2

    if (node1PositionX === node2PositionX) {
        return [
            [node1PositionX - 1 / 2,avgY,avgZ], 
            [node1PositionX + 1 / 2,avgY,avgZ]
        ]
    } else if (node1PositionY === node2PositionY) {
        return [
            [avgX,node1PositionY - 1 / 2,avgZ],
            [avgX,node1PositionY + 1 / 2,avgZ]
        ]
    } else if (node1PositionZ === node2PositionZ) {
        return [
            [avgX,avgY,node1PositionZ - 1 / 2],
            [avgX,avgY,node1PositionZ + 1 / 2]
        ]
    }
}

/**
 * This function generates the coordinates for the edges of a 3D arena.
 * It calculates the start and end coordinates for each edge based on the arena length.
 * The arena is assumed to be a cube, and each edge is represented by a pair of 3D coordinates.
 * The function returns an array of these coordinate pairs, one for each edge of the arena.
 *
 * @returns {Array<Array<Array<number>>>} - An array of coordinate pairs representing the edges of the arena.
 */
const generateArenaEdgeCoordinates = () => {
    const startEdgeCoordinate = 0 - 1/2
    const endEdgeCoordinate = ARENA_LENGTH - 1/2
    const arenaEdgeCoordinates = [
        [
            [startEdgeCoordinate, startEdgeCoordinate, startEdgeCoordinate],
            [endEdgeCoordinate, startEdgeCoordinate, startEdgeCoordinate]
        ],
        [
            [startEdgeCoordinate, startEdgeCoordinate, startEdgeCoordinate],
            [startEdgeCoordinate, endEdgeCoordinate, startEdgeCoordinate]
        ],
        [
            [startEdgeCoordinate, startEdgeCoordinate, startEdgeCoordinate],
            [startEdgeCoordinate, startEdgeCoordinate, endEdgeCoordinate]
        ],
        [
            [endEdgeCoordinate, startEdgeCoordinate, startEdgeCoordinate],
            [endEdgeCoordinate, endEdgeCoordinate, startEdgeCoordinate]
        ],
        [
            [endEdgeCoordinate, startEdgeCoordinate, startEdgeCoordinate],
            [endEdgeCoordinate, startEdgeCoordinate, endEdgeCoordinate]
        ],
        [
            [startEdgeCoordinate, endEdgeCoordinate, startEdgeCoordinate],
            [endEdgeCoordinate, endEdgeCoordinate, startEdgeCoordinate]
        ],
        [
            [startEdgeCoordinate, endEdgeCoordinate, startEdgeCoordinate],
            [startEdgeCoordinate, endEdgeCoordinate, endEdgeCoordinate]
        ],
        [
            [startEdgeCoordinate, startEdgeCoordinate, endEdgeCoordinate],
            [endEdgeCoordinate, startEdgeCoordinate, endEdgeCoordinate]
        ],
        [
            [startEdgeCoordinate, startEdgeCoordinate, endEdgeCoordinate],
            [startEdgeCoordinate, endEdgeCoordinate, endEdgeCoordinate]
        ],
        [
            [endEdgeCoordinate, endEdgeCoordinate, startEdgeCoordinate],
            [endEdgeCoordinate, endEdgeCoordinate, endEdgeCoordinate]
        ],
        [
            [startEdgeCoordinate, endEdgeCoordinate, endEdgeCoordinate],
            [endEdgeCoordinate, endEdgeCoordinate, endEdgeCoordinate]
        ],
        [
            [endEdgeCoordinate, startEdgeCoordinate, endEdgeCoordinate],
            [endEdgeCoordinate, endEdgeCoordinate, endEdgeCoordinate]
        ]
    ]

    return arenaEdgeCoordinates
}

const generateArenaEdges = () => {

    // Generate a list of all Nodes that have exactly 2 coordinates outside the Arena length
    const nodesOuterBorder = []
    for (let i = -1; i <= ARENA_LENGTH; i++) {
        for (let j = -1; j <= ARENA_LENGTH; j++) {
            for (let k = -1; k <= ARENA_LENGTH; k++) {
                const countOuter = [i,j,k].map((coord) => {
                    return coord < 0 || coord >= ARENA_LENGTH
                }).filter((coord) => coord === true).length
                if (countOuter === 2) {
                    nodesOuterBorder.push([i,j,k])
                }
            }
        }
    }

    // Generate a list of all EdgePoint pairs
    const arenaEdges = nodesOuterBorder.map((node) => {
        const innerNode = node.map((coord) => {
            if (coord === -1) {
                return 0
            } else if (coord === ARENA_LENGTH) {
                return ARENA_LENGTH - 1
            } else {
                return coord
            }
        })

        return [
            node,
            innerNode
        ]
    })

    return arenaEdges

}

const getEdgeNodesOuterBorder = (edgeNodes) => {
    const edgeNodesOuterBorderKeys = edgeNodes.filter((edgeNodes) => {
        const [node1Key, node2Key] = edgeNodes
        const node1 = keyToArray(node1Key)
        const node2 = keyToArray(node2Key)
        
        const node1CountOuter = node1.map((coord) => {
            return coord < 0 || coord >= ARENA_LENGTH
        }).filter((coord) => coord === true).length
        const node2CountOuter = node2.map((coord) => {
            return coord < 0 || coord >= ARENA_LENGTH
        }).filter((coord) => coord === true).length

        return (node1CountOuter === 2) || (node2CountOuter === 2)
    })

    const edgeNodesOuterBorder = edgeNodesOuterBorderKeys.map((edgeNodesKey) => {
        const [node1Key, node2Key] = edgeNodesKey
        const node1 = keyToArray(node1Key)
        const node2 = keyToArray(node2Key)
        return [node1, node2]
    })

    return edgeNodesOuterBorder
}

const isSameEdge = (edge1, edge2) => {
    if (equalArrays(edge1[0], edge2[0]) && equalArrays(edge1[1], edge2[1])) {
        return true
    } else if (equalArrays(edge1[0], edge2[1]) && equalArrays(edge1[1], edge2[0])) {
        return true
    } else {
        return false
    }
}

const getArenaEdges = (attackZoneEdges) => {
    const allArenaEdges = generateArenaEdges()
    const edgeNodesOuterBorder = getEdgeNodesOuterBorder(attackZoneEdges)

    const arenaEdgesNoConflict = allArenaEdges.filter((arenaEdge) => {
        return edgeNodesOuterBorder.every((edgeNodes) => {
            return !isSameEdge(arenaEdge, edgeNodes)
        })
    })

    return arenaEdgesNoConflict
}




export {
    arrayToKey,
    keyToArray,
    getEdgesFromPositionKeys,
    getAllAttackedPositionsKeys,
    getEdgeEndPoints,
    generateArenaEdgeCoordinates,
    generateArenaEdges,
    getEdgeNodesOuterBorder,
    isSameEdge,
    getArenaEdges
}