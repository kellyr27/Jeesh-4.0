const ARENA_LENGTH = 11

const INITIAL_SOLDIERS = [
    {
        id: 1,
        gamePosition: [0, 0, 0],
        direction: '+z',
    },
    {
        id: 2,
        gamePosition: [1, 0, 1],
        direction: '+y',
    },
    {
        id: 3,
        gamePosition: [2, 2, 2],
        direction: '+x',
    }
]


export {
    ARENA_LENGTH,
    INITIAL_SOLDIERS
}