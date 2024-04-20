import { Vector3, Matrix4 } from 'three'

/**
 * This function generates a transformation matrix that can be used to position and orient objects in a 3D space.
 * It takes as input a center position, and generates two random vectors and a normal vector from these.
 * The transformation matrix is then created using the 'lookAt' method, which makes the transformed object look at a certain point in space.
 * The point to look at is calculated by adding the normal vector to the center position.
 * The 'up' direction for the transformed object is set to the positive y-axis.
 *
 * @param {Array<number>} centerPosition - The 3D coordinates of the center position.
 * @returns {THREE.Matrix4} - A transformation matrix that can be used to position and orient objects in a 3D space.
 */
const getTransformerMatrix = ( centerPosition ) => {
    const center = new Vector3(
        centerPosition[0], 
        centerPosition[1], 
        centerPosition[2]
    )
    const randomVector1 = new Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5, 
        Math.random() - 0.5 
    )
    const randomVector2 = new Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5, 
        Math.random() - 0.5  
    )
    const normal = new Vector3().crossVectors(randomVector1, randomVector2).normalize()
    return new Matrix4().lookAt(center, center.clone().add(normal), new Vector3(0, 1, 0))
}

/**
 * This function calculates the normal vector of a plane defined by three points in 3D space.
 * The points are hardcoded in the function, and the plane is defined by the vectors from the first point to the other two.
 * The normal vector is calculated by taking the cross product of these two vectors and normalizing the result.
 * The function then applies a transformation matrix to the normal vector and returns the transformed vector.
 *
 * @param {THREE.Matrix4} transformMatrix - A transformation matrix to apply to the normal vector.
 * @returns {THREE.Vector3} - The transformed normal vector of the plane.
 */
const getNormalVector = (transformMatrix) => {
    const p1 = new Vector3(10, 0, 27)
    const p2 = new Vector3(9, 0 , 5)
    const p3 = new Vector3(2, 0, 2)
    
    const v1 = new Vector3().subVectors(p2, p1)
    const v2 = new Vector3().subVectors(p3, p1)

    const temp = new Vector3().crossVectors(v1, v2).normalize()
    return temp.clone().applyMatrix4(transformMatrix)
}

export { 
    getTransformerMatrix,
    getNormalVector
}