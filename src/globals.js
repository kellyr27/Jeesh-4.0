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

const ARENA_OFFSET = 1 / 2 - ARENA_LENGTH / 2


export {
    ARENA_LENGTH,
    INITIAL_SOLDIERS,
    ARENA_OFFSET
}