import { checkIfInArena } from "../../../../utils/displayHelpers";
import { ARENA_LENGTH } from "../../../../globals";
import {Line} from '@react-three/drei';
import { useState } from "react";
import {equalArrays} from "../../../../utils/arrayHelpers"

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
    const edge1Points = getPoints(edge1[0], edge1[1])
    const edge2Points = getPoints(edge2[0], edge2[1])

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

// Creates a Key for a coordinate
const createCoordKey = (coord) => {
    const [x,y,z] = coord

    return `${x}-${y}-${z}`
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


const getPoints = (position1, position2) => {

    const [position1X, position1Y, position1Z] = position1
    const [position2X, position2Y, position2Z] = position2

    const avgX = (position1X + position2X) / 2
    const avgY = (position1Y + position2Y) / 2
    const avgZ = (position1Z + position2Z) / 2

    if (position1X === position2X) {
        return [
            [position1X - 1 / 2,avgY,avgZ], 
            [position1X + 1 / 2,avgY,avgZ]
        ]
    } else if (position1Y === position2Y) {
        return [
            [avgX,position1Y - 1 / 2,avgZ],
            [avgX,position1Y + 1 / 2,avgZ]
        ]
    } else if (position1Z === position2Z) {
        return [
            [avgX,avgY,position1Z - 1 / 2],
            [avgX,avgY,position1Z + 1 / 2]
        ]
    }
}

const ArenaEdges = () => {

    const [edges, setEdges] = useState(getCubeEdgeConnections())

    return (
        <>
            {edges.map((edge, index) => {
                // console.log(edge[0][0], edge[0][1], getPoints(edge[0][0], edge[0][1]))

                // Get random color for each edge
                // const randomColor = Math.floor(Math.random()*16777215).toString(16);
                return (
                    <>
                    {edge ? (
                        <Line
                          key={index}
                          points={getPoints(edge[0][0], edge[0][1])}
                          color='red'
                          linewidth={1}
                        />
                      ) : null}
                    </>
                )
            })}
        </>
    )
}

export default ArenaEdges;