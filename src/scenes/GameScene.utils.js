import {isValidDirection} from '../utils/directionHelpers'
import {addArrays, subtractArrays, equalArrays} from '../utils/arrayHelpers'

/**
 * Returns a mapping of cardinal directions to their corresponding directions in a 3D space.
 * @param {string} direction - The input direction. Should be one of '+x', '-x', '+y', '-y', '+z', '-z'.
 * @returns {object} An object that maps 'face', 'left', 'right', 'up', 'down' to their corresponding directions in a 3D space.
 * @throws {Error} Will throw an error if the input direction is not one of '+x', '-x', '+y', '-y', '+z', '-z'.
 */
const getCardinalDirectionMap = (direction) => {

    if (!isValidDirection(direction)) {
        throw new Error('Invalid direction. Expected one of "+x", "-x", "+y", "-y", "+z", "-z".');
    }

	switch (direction) {
		case '+x':
			return {
				face: '+x',
				left: '-z',
				right: '+z',
				up: '+y',
				down: '-y'
			}
		case '-x':
			return {
				face: '-x',
				left: '+z',
				right: '-z',
				up: '+y',
				down: '-y'
			}
		case '+y':
			return {
				face: '+y',
				left: '-x',
				right: '+x',
				up: '+z',
				down: '-z'
			}
		case '-y':
			return {
				face: '-y',
				left: '-x',
				right: '+x',
				up: '-z',
				down: '+z'
			}
		case '+z':
			return {
				face: '+z',
				left: '-x',
				right: '+x',
				up: '+y',
				down: '-y'
			}
		case '-z':
			return {
				face: '-z',
				left: '+x',
				right: '-x',
				up: '+y',
				down: '-y'
			}
		default:
			return {
				face: '+z',
				left: '-x',
				right: '+x',
				up: '+y',
				down: '-y'
			}
	}
}

const getPossibleMovePositions = (selectedSoldierPosition, starPositions, soldierPositions) => {

    const allRelativeSurroundingPositions = []

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            for (let k = -1; k <= 1; k++) {
                if (!(i === 0 && j === 0 && k === 0)) {
                    allRelativeSurroundingPositions.push([i, j, k])
                }
            }
        }
    }

    const allSurroundingPositions = allRelativeSurroundingPositions.map((position) => {
        return addArrays(selectedSoldierPosition, position)
    })


    const surroundingPositions = allSurroundingPositions.filter((position) => {
        const isSoldierPosition = soldierPositions.some(soldierPosition => equalArrays(soldierPosition, position))
        const isStarPosition = starPositions.some(starPosition => equalArrays(starPosition, position))

        return (!isSoldierPosition && !isStarPosition)
    })

    const relativeSurroundingPositions = surroundingPositions.map((position) => {
        return subtractArrays(position, selectedSoldierPosition)
    })

    return relativeSurroundingPositions
}


export { getCardinalDirectionMap, getPossibleMovePositions }