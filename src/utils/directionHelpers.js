
const isValidDirection = (direction) => {
    return ['+x', '-x', '+y', '-y', '+z', '-z'].includes(direction)
}


/**
 * This function takes a direction string as input and returns the opposing direction.
 * The input direction string is expected to start with either '+' or '-' followed by a character representing the axis (e.g., 'x', 'y', 'z').
 * If the input direction starts with '+', the function returns the direction with '-' and vice versa.
 * For example, if the input is '-z', the function will return '+z'.
 *
 * @param {string} direction - The input direction string. Should start with '+' or '-' followed by the axis character.
 * @returns {string} The opposing direction string.
 */
const getOpposingDirection = (direction) => {

    if (!isValidDirection(direction)) {
        throw new Error('Invalid direction. Expected one of "+x", "-x", "+y", "-y", "+z", "-z".');
    }

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

const equalDirections = (direction1, direction2) => {
    return direction1 === direction2
}

const getRotationFromDirection = (direction) => {
    const directionMap = {
        '+x': [0, 0, Math.PI / 2],
        '-x': [0, 0, - Math.PI / 2],
        '+y': [0, 0, Math.PI],
        '-y': [0, 0, 0],
        '+z': [- Math.PI/2, 0, 0],
        '-z': [Math.PI/2, 0, 0],
    }

    if (directionMap.hasOwnProperty(direction)) {
        return directionMap[direction]
    } else {
        console.error('Invalid direction inputted into getRotationFromDirection')
        return [0, 0, 0]
    }

}

export { 
    getOpposingDirection, 
    getRelativeDirectionArray, 
    equalDirections, 
    getRotationFromDirection, 
}