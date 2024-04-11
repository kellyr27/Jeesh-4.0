import { addArrays } from "../../../utils/arrayHelpers"

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


export {
    arrayToKey,
    keyToArray,
    getEdgesFromPositionKeys
}