import { ARENA_LENGTH } from "../globals"
import {equalDirections, getRelativeDirectionArray} from "./directionHelpers"
import {LineCurve3, QuadraticBezierCurve3, Vector3, Object3D, Quaternion, Euler} from "three"
import { subtractArrays, equalArrays } from './arrayHelpers';
import {checkIfPositionInArray} from './poseHelpers'

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

const getAllAttackedPositions = (soldiers) => {
    // Count of more many times a position is attack
    let attackedPositionsCount = new Map()

    for (const soldier of soldiers) {
        const attackedPositions = getAttackedPositions(soldier.gamePosition, soldier.direction)
        
        attackedPositions.forEach((position) => {
            if (attackedPositionsCount.has(position)) {
                attackedPositionsCount.set(position, attackedPositionsCount.get(position) + 1)
            } else {
                attackedPositionsCount.set(position, 1)
            }
        })
    }

    // Return two lists, the first one with positions only attacked once, another with positions attacked more than once
    let attackedOnce = []
    let attackedMultiple = []

    for (const [position, count] of attackedPositionsCount) {
        if (count === 1) {
            attackedOnce.push(position)
        } else {
            attackedMultiple.push(position)
        }
    
    }

    return [attackedOnce, attackedMultiple]
}



const getMovePath = (pose1, pose2) => {

    const { position: position1} = pose1
    const { position: position2, direction: direction2 } = pose2

    // Find the control point for the curve
    const controlPoint = subtractArrays(position2, getRelativeDirectionArray(direction2))

    if (equalArrays(controlPoint, position1)) {

        const curve = new LineCurve3(
            new Vector3(...position1),
            new Vector3(...position2)
        )

        return curve
    } else {
        const controlPoint = subtractArrays(position2, getRelativeDirectionArray(direction2))

        const curve = new QuadraticBezierCurve3(
            new Vector3(...position1),
            new Vector3(...controlPoint),
            new Vector3(...position2)
        )

        return curve
    }
}

function getLookAtRotation(target) {

    const dummyObject = new Object3D();
    dummyObject.lookAt(target);
    
    // Rotate the object to face the right direction for the Cone Object
    dummyObject.rotateOnAxis(new Vector3(1, 0, 0), - Math.PI / 2)

    dummyObject.updateMatrixWorld()
    return [dummyObject.rotation.x, dummyObject.rotation.y, dummyObject.rotation.z]
}

function getShortestRotationQuaternion(lookAtA, lookAtB) {
    // Create the quaternion representing the rotation from lookAtA to lookAtB
    const quaternion = new Quaternion().setFromUnitVectors(lookAtA, lookAtB);

    return quaternion;
}

function generateStarPositions() {
    const positions = []

    // Generate a random number of stars up to the ARENA_LENGTH squared
    const numStars = Math.floor(Math.random() * ARENA_LENGTH ** 2)

    while (positions.length < numStars) {
        const x = Math.floor(Math.random() * ARENA_LENGTH)
        const y = Math.floor(Math.random() * ARENA_LENGTH)
        const z = Math.floor(Math.random() * ARENA_LENGTH)

        if (!checkIfPositionInArray([x, y, z], positions)) {
            positions.push([x, y, z])
        }
    }

    return positions
    
}

const convertEulerToQuaternion = (rotation) => {
    let euler = new Euler(...rotation, 'XYZ');

    const quaternion = new Quaternion()
    quaternion.setFromEuler(euler)
    return quaternion
}

/**
 * Geta Quaternion rotation from an lookAt unit vector
 */
const upVector = new Vector3(0, -1, 0)
const getQuaternionFromLookAt = (lookAt) => {
    const quaternion = new Quaternion()
    quaternion.setFromUnitVectors(upVector, lookAt);
    return quaternion
}


export {
    offsetCoord,
    offsetCoords,
    centerCoord,
    centerCoords,
    checkIfInArena,
    getAttackedPositions,
    getAllAttackedPositions,
    getMovePath,
    getLookAtRotation,
    getShortestRotationQuaternion,
    generateStarPositions,
    convertEulerToQuaternion,
    getQuaternionFromLookAt
}