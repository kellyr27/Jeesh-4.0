const checkIfPositionInArray = (position, array) => {
    return array.some((element) => {
        return element[0] === position[0] && element[1] === position[1] && element[2] === position[2]
    })
}

export { checkIfPositionInArray }