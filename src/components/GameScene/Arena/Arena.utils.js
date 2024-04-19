import { addArrays } from "../../../utils/arrayHelpers"
import { checkIfInArena } from "../../../utils/displayHelpers"
import { equalDirections } from "../../../utils/directionHelpers"

const arrayToKey = (array) => {
    return array.join('_')
}

const keyToArray = (key) => {
    return key.split('_').map(Number)
}

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



export {
    arrayToKey,
    keyToArray,
    getEdgesFromPositionKeys,
    getAllAttackedPositionsKeys
}