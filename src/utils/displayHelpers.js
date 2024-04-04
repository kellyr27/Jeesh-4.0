import { ARENA_LENGTH } from "../globals"
import {equalDirections} from "./directionHelpers"

/**
 * Takes a coordinate and positions it to the centre of the Cube
 */
const offsetCoord = (coord) => {
    const [x, y, z] = coord
    const offset = 0.5
    return [x + offset, y + offset, z + offset]
}

const offsetCoords = (coords) => {
    return coords.map((coord) => {
        return offsetCoord(coord)
    })
}

const centerCoord = (coord) => {
    const [x, y, z] = offsetCoord(coord)
    const centerOffset = - ARENA_LENGTH / 2
    return [x + centerOffset, y + centerOffset, z + centerOffset]
}

const centerCoords = (coords) => {
    return coords.map((coord) => {
        return centerCoord(coord)
    })
}

/**
 * Checks if Cube coordinate is inside the Arena
 */
const checkIfInArena = (coord) => {
    for (const axes of coord) {
        if (!(axes >= 0 && axes < ARENA_LENGTH)) {
            return false
        }
    }
    return true
}

/**
 * Get all Attacked Cubes
 */
const getAttackedPositions = (position, direction) => {

    let attackedPositions = []

    for (let i = position[0] - 1; i <= position[0] + 1; i++) {
        for (let j = position[1] - 1; j <= position[1] + 1; j++) {
            for (let k = position[2] - 1; k <= position[2] + 1; k++) {
                if (checkIfInArena([i,j,k])) {
                    attackedPositions.push([i,j,k])
                }
            }
        }
    }

    console.log(attackedPositions)

    // Offset Attacked Coords to match direction
    if (equalDirections(direction, '+x')) {
        attackedPositions = attackedPositions.map((position) => {
            return [position[0] + 2, position[1], position[2]]
        })
    } else if (equalDirections(direction, '-x')) {
        attackedPositions = attackedPositions.map((position) => {
            return [position[0] - 2, position[1], position[2]]
        })
    } else if (equalDirections(direction, '+y')) {
        attackedPositions = attackedPositions.map((position) => {
            return [position[0], position[1] + 2, position[2]]
        })
    } else if (equalDirections(direction, '-y')) {
        attackedPositions = attackedPositions.map((position) => {
            return [position[0], position[1] - 2, position[2]]
        })
    } else if (equalDirections(direction, '+z')) {
        attackedPositions = attackedPositions.map((position) => {
            return [position[0], position[1], position[2] + 2]
        })
    } else if (equalDirections(direction, '-z')) {
        attackedPositions = attackedPositions.map((position) => {
            return [position[0], position[1], position[2] - 2]
        })
    }

    return attackedPositions
}


export {
    offsetCoord,
    offsetCoords,
    centerCoord,
    centerCoords,
    checkIfInArena,
    getAttackedPositions
}