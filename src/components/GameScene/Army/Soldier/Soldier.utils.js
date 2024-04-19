import { LineCurve3, QuadraticBezierCurve3, Vector3 } from 'three'
import { subtractArrays, equalArrays } from '../../../../utils/arrayHelpers';
import {getRelativeDirectionArray} from "../../../../utils/directionHelpers"

/**
 * This function calculates a specified number of points along a given path up to a certain percentage of the path's length.
 * It divides the path into equal segments based on the number of points requested, and calculates the point at each segment.
 * The percentage of the path's length to calculate points for is specified by the parameter 't'.
 *
 * @param {THREE.Path} movePath - The path to calculate points for.
 * @param {number} t - The percentage of the path's length to calculate points for, as a decimal (e.g., 0.5 for 50%).
 * @param {number} numPoints - The number of points to calculate along the path. Defaults to 10.
 * @returns {Array<THREE.Vector3>} - An array of points along the path, or null if the input parameters are invalid.
 */
function getPointsUpToT(movePath, t, numPoints = 10) {

    if (!movePath || numPoints <= 0 || t <= 0) {
        return null
    }

    const points = [];
    for (let i = 0; i < numPoints; i++) {
        
        let t1 = (i / (numPoints - 1)) * t;
        t1 = Math.min(t1, 1)

        const point = movePath.getPointAt(t1);

        points.push(point);
    }
    return points;
}

/**
 * This function calculates a path between two poses using either a straight line or a quadratic bezier curve.
 * It first extracts the game positions from the two poses.
 * Then it calculates a control point based on the second pose's position and direction.
 * If the control point is equal to the first pose's position, it creates a straight line between the two positions.
 * Otherwise, it creates a quadratic bezier curve with the control point.
 *
 * @param {Object} pose1 - The first pose, containing a 'gamePosition' property which is an array of three numbers.
 * @param {Object} pose2 - The second pose, containing a 'gamePosition' property and a 'direction' property.
 * @returns {THREE.LineCurve3|THREE.QuadraticBezierCurve3} - A THREE.js curve object representing the path between the two poses.
 */
const getMovePath = (pose1, pose2) => {

    const { gamePosition: position1} = pose1
    const { gamePosition: position2, direction: direction2 } = pose2

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

export {
    getPointsUpToT,
    getMovePath
}