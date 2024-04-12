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

const getAllAttackedPositionsKeys = (soldiers) => {
    // Count of more many times a position is attack
    let attackedPositionsCount = new Map()

    for (const soldier of soldiers) {
        const attackedPositions = getAttackedPositions(soldier.gamePosition, soldier.direction)
        
        attackedPositions.forEach((position) => {
            const stringPosition = position.join('_')

            if (attackedPositionsCount.has(stringPosition)) {
                attackedPositionsCount.set(stringPosition, attackedPositionsCount.get(stringPosition) + 1)
            } else {
                attackedPositionsCount.set(stringPosition, 1)
            }
        })
    }

    // Return two lists, the first one with positions only attacked once, another with positions attacked more than once
    let attackedOnce = []
    let attackedMultiple = []

    for (const [stringPosition, count] of attackedPositionsCount) {
        if (count === 1) {
            attackedOnce.push(stringPosition)
        } else {
            attackedMultiple.push(stringPosition)
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

function generateStarPositions(soldierPositions) {

    const positions = []

    // Generate a random number of stars up to the ARENA_LENGTH squared
    const numStars = Math.floor(Math.random() * ARENA_LENGTH ** 2)

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

/**
 * Get the Edge end points from two nodes
 */
const getEdgeEndPoints = (node1Position, node2Position) => {

    const [node1PositionX, node1PositionY, node1PositionZ] = node1Position
    const [node2PositionX, node2PositionY, node2PositionZ] = node2Position

    const avgX = (node1PositionX + node2PositionX) / 2
    const avgY = (node1PositionY + node2PositionY) / 2
    const avgZ = (node1PositionZ + node2PositionZ) / 2

    if (node1PositionX === node2PositionX) {
        return [
            [node1PositionX - 1 / 2,avgY,avgZ], 
            [node1PositionX + 1 / 2,avgY,avgZ]
        ]
    } else if (node1PositionY === node2PositionY) {
        return [
            [avgX,node1PositionY - 1 / 2,avgZ],
            [avgX,node1PositionY + 1 / 2,avgZ]
        ]
    } else if (node1PositionZ === node2PositionZ) {
        return [
            [avgX,avgY,node1PositionZ - 1 / 2],
            [avgX,avgY,node1PositionZ + 1 / 2]
        ]
    }
}

/**
 * Checks if an Edge exists between two coordinates
 */
const checkIfEdgeBetweenNodes = (a, b) => {
    const [iDiff, jDiff, kDiff] = [Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2])]

    if (!checkIfInArena(a) && !checkIfInArena(b)) {
        return false
    }

    if ((iDiff === 1) && (jDiff === 1) && (kDiff === 0)) {
        return true
    } else if ((iDiff === 1) && (jDiff === 0) && (kDiff === 1)) {
        return true
    } else if ((iDiff === 0) && (jDiff === 1) && (kDiff === 1)) {
        return true
    } else {
        return false
    }
}

const isSharedEdge = (edge1, edge2) => {
    const edge1Points = getEdgeEndPoints(edge1[0].position, edge1[1].position)
    const edge2Points = getEdgeEndPoints(edge2[0].position, edge2[1].position)

    if (equalArrays(edge1Points[0], edge2Points[0]) && equalArrays(edge1Points[1], edge2Points[1])) {
        return true
    } else if (equalArrays(edge1Points[0], edge2Points[1]) && equalArrays(edge1Points[1], edge2Points[0])) {
        return true
    } else {
        return false
    }
}

const isOuterEdgeNode = (node) => {

    // Check if at least two of the coordinates are outside the arena
    let outsideCount = 0

    for (let i = 0; i < node.length; i++) {
        if (node[i] < 0 || node[i] >= ARENA_LENGTH) {
            outsideCount++
        }
    }

    return outsideCount >= 2

}

function getCubeEdgeConnections() {
    

    // Find a list of an Nodes (from -1 to n+1)
    const nodes = []
    for (let i = -1; i < ARENA_LENGTH + 1; i++) {
        for (let j = -1; j < ARENA_LENGTH + 1; j++) {
            for (let k = -1; k < ARENA_LENGTH + 1; k++) {
                const node = [i,j,k]
                nodes.push(node)
            }
        }
    }

    // Now find all the edges that are connected to each node
    const edges = []
    for (let i = 0; i < nodes.length - 1; i++) {
        for (let j = i+1; j < nodes.length; j++) {

            const node1 = nodes[i]
            const node2 = nodes[j]

            if (checkIfEdgeBetweenNodes(node1, node2)) {
                const edge = [node1, node2]
                edges.push(edge)
            }
        }
    }

    const combinedEdges = []

    for (let i = 0; i < edges.length - 1; i++) {
        for (let j = i+1; j < edges.length; j++) {

            if (isSharedEdge(edges[i], edges[j])) {
                combinedEdges.push([edges[i], edges[j]])
                break
            }
        }
    }
        
    for (let i = 0; i < edges.length; i++) {
        const isNode1onOuterBorder = isOuterEdgeNode(edges[i][0])
        const isNode2onOuterBorder = isOuterEdgeNode(edges[i][1])
        if ((isNode1onOuterBorder && !isNode2onOuterBorder) || (!isNode1onOuterBorder && isNode2onOuterBorder)) {
            combinedEdges.push([edges[i], null])
        }
    }


    return combinedEdges

}

function getCubeEdgeConnections2(nodes) {

    // Now find all the edges that are connected to each node
    const edges = []
    for (let i = 0; i < nodes.length - 1; i++) {
        for (let j = i+1; j < nodes.length; j++) {

            const node1 = nodes[i]
            const node2 = nodes[j]

            if (checkIfEdgeBetweenNodes(node1.position, node2.position)) {
                const edge = [node1, node2]
                edges.push(edge)
            }
        }
    }

    const combinedEdges = []

    for (let i = 0; i < edges.length - 1; i++) {
        for (let j = i+1; j < edges.length; j++) {

            if (isSharedEdge(edges[i], edges[j])) {
                combinedEdges.push([edges[i], edges[j]])
                break
            }
        }
    }
    
    for (let i = 0; i < edges.length; i++) {

        const isNode1onOuterBorder = isOuterEdgeNode(edges[i][0].position)
        const isNode2onOuterBorder = isOuterEdgeNode(edges[i][1].position)
        if ((isNode1onOuterBorder && !isNode2onOuterBorder) || (!isNode1onOuterBorder && isNode2onOuterBorder)) {
            combinedEdges.push([edges[i], null])
        }
    }


    return combinedEdges

}



export {
    offsetCoord,
    offsetCoords,
    centerCoord,
    centerCoords,
    checkIfInArena,
    getAttackedPositions,
    getAllAttackedPositionsKeys,
    getMovePath,
    getLookAtRotation,
    getShortestRotationQuaternion,
    generateStarPositions,
    convertEulerToQuaternion,
    getQuaternionFromLookAt,
    getEdgeEndPoints,
    getCubeEdgeConnections,
    getCubeEdgeConnections2
}