const isPosition = (position) => {
    return position.length === 3;
}

const subtractPositions = (position1, position2) => {

    if (!isPosition(position1) || !isPosition(position2)) {
        throw new Error('Invalid position')
    }

    return position1.map((el, index) => {
        return el - position2[index]
    })
}

const addPositions = (...positions) => {

    // No error checking to keep it optimize speed

    return positions[0].map((_, index) => {
        return positions.reduce((sum, arr) => sum + arr[index], 0);
    });
};

const isSamePosition = (position1, position2) => {

    if (!isPosition(position1) || !isPosition(position2)) {
        throw new Error('Invalid position')
    }

    return position1.every((el, index) => {
        return el === position2[index]
    })
}

const isPositionInArray = (position, positionArray) => {

    if (!isPosition(position)) {
        throw new Error('Invalid position')
    }

    return positionArray.some((positionInArray) => {
        return isSamePosition(positionInArray, position)
    })
}

export { 
    subtractPositions, 
    addPositions, 
    isSamePosition,
    isPositionInArray
}