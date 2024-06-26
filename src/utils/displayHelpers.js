import { ARENA_LENGTH } from "../globals"
import { Vector3, Object3D, Quaternion, Euler} from "three"

/**
 * Takes a coordinate and positions it to the centre of the Cube
 */
const offsetCoord = (coord) => {
    const offset = 0.5

    if (Array.isArray(coord)) {
        const [x, y, z] = coord
        return [x + offset, y + offset, z + offset]
    }
    else if (typeof coord === 'object') {
        return coord.set(
            coord.x + offset,
            coord.y + offset,
            coord.z + offset
        )
    }
}

const offsetCoords = (coords) => {
    return coords.map((coord) => {
        return offsetCoord(coord)
    })
}

const centerCoord = (coord) => {
    const centerOffset = - ARENA_LENGTH / 2

    if (Array.isArray(coord)) {
        const [x, y, z] = offsetCoord(coord)
        return [x + centerOffset, y + centerOffset, z + centerOffset]
    }
    else if (typeof coord === 'object') {
        offsetCoord(coord)

        return coord.set(
            coord.x + centerOffset,
            coord.y + centerOffset,
            coord.z + centerOffset
        )
    }
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
    getLookAtRotation,
    getShortestRotationQuaternion,
    convertEulerToQuaternion,
    getQuaternionFromLookAt,
}