import { ARENA_LENGTH } from "../globals"

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

export {
    offsetCoord,
    offsetCoords,
    centerCoord,
    centerCoords,
    checkIfInArena
}