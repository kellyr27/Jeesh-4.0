import { Vector3, Matrix4, Color, BufferAttribute } from 'three'

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

/**
 * This function generates the positions and colors for a galaxy of stars.
 * It takes as input several parameters that control the shape, size, and color of the galaxy.
 * The positions of the stars are calculated using a combination of random values and trigonometric functions to create a spiral shape.
 * The colors of the stars are a mix of two input colors, with the mix ratio depending on the distance of the star from the center of the galaxy.
 * The function then applies a transformation matrix to each position to allow for additional transformations of the galaxy.
 * The function returns two BufferAttributes: one for the positions of the stars, and one for their colors.
 *
 * @param {number} count - The number of stars in the galaxy.
 * @param {string} colorIn - The color of the stars at the center of the galaxy.
 * @param {string} colorOut - The color of the stars at the outer edge of the galaxy.
 * @param {number} radius - The radius of the galaxy.
 * @param {number} spin - The amount of spin in the galaxy's spiral arms.
 * @param {number} branches - The number of spiral arms in the galaxy.
 * @param {number} randomnessPower - The power to which the random values for the star positions are raised.
 * @param {number} randomness - The amount of randomness in the star positions.
 * @param {THREE.Matrix4} transformMatrix - A transformation matrix to apply to the star positions.
 * @returns {Array<THREE.BufferAttribute>} - An array containing two BufferAttributes: one for the positions of the stars, and one for their colors.
 */
const generateGalaxy = (
    count, 
    colorIn, 
    colorOut, 
    radius, 
    spin, 
    branches, 
    randomnessPower,
    randomness,
    transformMatrix
) => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorInside = new Color(colorIn);
    const colorOutside = new Color(colorOut);

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
    
        const radiusValue = Math.random() * radius;
        const spinAngle = radiusValue * spin;
        const branchAngle = ((i % branches) / branches) * Math.PI * 2;
    
        const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radiusValue;
        const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radiusValue;
        const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radiusValue;
    
        positions[i3] = Math.cos(branchAngle + spinAngle) * radiusValue + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radiusValue + randomZ;
        
        const point = new Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
        const transformedPoint = point.clone().applyMatrix4(transformMatrix)

        positions[i3] = transformedPoint.x;
        positions[i3 + 1] = transformedPoint.y;
        positions[i3 + 2] = transformedPoint.z;
    
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radiusValue / radius);
    
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    return [
        new BufferAttribute(positions, 3),
        new BufferAttribute(colors, 3)
    ]
};

export { 
    getTransformerMatrix,
    getNormalVector,
    generateGalaxy
}