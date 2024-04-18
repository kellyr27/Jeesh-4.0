import {isValidDirection} from '../../utils/directionHelpers'
import {addArrays, subtractArrays, equalArrays} from '../../utils/arrayHelpers'
import {ARENA_LENGTH} from '../../globals'
import {checkIfPositionInArray} from '../../utils/poseHelpers'
import { checkIfInArena } from '../../utils/displayHelpers'

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
		const isInArena = checkIfInArena(position)

        return (!isSoldierPosition && !isStarPosition && isInArena)
    })

    const relativeSurroundingPositions = surroundingPositions.map((position) => {
        return subtractArrays(position, selectedSoldierPosition)
    })

    return relativeSurroundingPositions
}

function generateStarPositions(soldierPositions) {

    const positions = []

    // Generate a random number of stars up to the ARENA_LENGTH squared
    const numStars = Math.floor(Math.random() * ARENA_LENGTH ** 2 / 2)

    while (positions.length < numStars) {
        const x = Math.floor(Math.random() * ARENA_LENGTH)
        const y = Math.floor(Math.random() * ARENA_LENGTH)
        const z = Math.floor(Math.random() * ARENA_LENGTH)

        if (!checkIfPositionInArray([x, y, z], positions) && !checkIfPositionInArray([x, y, z], soldierPositions)) {
            positions.push([x, y, z])
        }
    }

    return positions
    
}

export { 
	getCardinalDirectionMap, 
	getPossibleMovePositions, 
	generateStarPositions
}