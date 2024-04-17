import { checkIfPositionInArray } from "./utils/poseHelpers"

const ARENA_LENGTH = 20

// TODO: Remove id
const INITIAL_SOLDIERS = [
    {
        id: 1,
        gamePosition: [5, 5, 4],
        direction: '+z',
    },
    {
        id: 2,
        gamePosition: [4, 4, 9],
        direction: '-z',
    },
    {
        id: 3,
        gamePosition: [2, 2, 2],
        direction: '+x',
    }
]

const generateInitialSoldier = () => {
    // Randomly generate a number between 1 and 15
    const numSoldiers = Math.floor(Math.random() * 25) + 5

    const soldierPositions = []
    while (soldierPositions.length < numSoldiers) {
        const x = Math.floor(Math.random() * ARENA_LENGTH)
        const z = Math.floor(Math.random() * ARENA_LENGTH)
        const y = Math.floor(Math.random() * ARENA_LENGTH)

        const position = [x, y, z]

        if (!checkIfPositionInArray(position, soldierPositions)) {
            soldierPositions.push(position)
        }
    }

    const directions = ['+x', '-x', '+y', '-y', '+z', '-z']

    const soldierPoses = soldierPositions.map((position) => {

        const randomDirection = directions[Math.floor(Math.random() * directions.length)]

        return {
            gamePosition: position,
            direction: randomDirection
        }
    })


    return soldierPoses
}

const ARENA_OFFSET = 1 / 2 - ARENA_LENGTH / 2


export {
    ARENA_LENGTH,
    INITIAL_SOLDIERS,
    ARENA_OFFSET,
    generateInitialSoldier
}