import { Vector3, Object3D } from "three";

/**
 * This function calculates the vector to add to the current position of the camera 
 * in order to move it in the specified direction and distance.
 *
 * @param {THREE.Vector3} direction - The direction in which to move the camera.
 * @param {number} distance - The distance to move the camera.
 * @returns {THREE.Vector3} - The vector to add to the current position of the camera.
 */
const getAddVector = (direction, distance) => {
    // Error checking
    if (!(direction instanceof Vector3)) {
        throw new Error('direction must be an instance of THREE.Vector3');
    }
    if (typeof distance !== 'number') {
        throw new Error('distance must be a number');
    }

    return direction.clone().multiplyScalar(- distance);
}

/**
 * This function calculates the world direction of a soldier object after it has been rotated.
 * It first clones the soldier object, then rotates it around the X-axis by 90 degrees (PI/2 radians).
 * After updating the world matrix of the rotated soldier, it calculates the world direction and returns it.
 *
 * @param {THREE.Object3D} selectedSoldierObject - The soldier object to calculate the rotated direction for.
 * @returns {THREE.Vector3} - The world direction of the rotated soldier object.
 */
const getRotatedSoldierDirection = (selectedSoldierObject) => {
    // Error checking
    if (!(selectedSoldierObject instanceof Object3D)) {
        throw new Error('selectedSoldierObject must be an instance of THREE.Object3D');
    }

    const worldDirection = new Vector3();
    const rotatedSoldier = selectedSoldierObject.clone();
    rotatedSoldier.rotateOnAxis(new Vector3(1, 0, 0), Math.PI / 2);
    rotatedSoldier.updateMatrixWorld();
    rotatedSoldier.getWorldDirection(worldDirection);

    return worldDirection;
}

export {
    getAddVector, 
    getRotatedSoldierDirection
};