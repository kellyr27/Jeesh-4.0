
const getOpposingDirection = (direction) => {
    const polarity = direction[0]

    if (polarity === '+') {
        return '-' + direction[1]
    } else {
        return '+' + direction[1]
    }
}

  
const getRelativeDirectionArray = (direction) => {

    const directionMap = {
        '+x': [1, 0, 0],
        '-x': [-1, 0, 0],
        '+y': [0, 1, 0],
        '-y': [0, -1, 0],
        '+z': [0, 0, 1],
        '-z': [0, 0, -1],
    }

    if (directionMap.hasOwnProperty(direction)) {
        return directionMap[direction]
    } else {
        console.error('Invalid direction inputted into getRelativeDirectionArray')
        return [0, 0, 0]
    }
}

export { getOpposingDirection, getRelativeDirectionArray }