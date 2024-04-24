import React, {useState, useEffect} from "react";
import ArenaNode from "./ArenaNode/ArenaNode";
import ArenaEdge from "./ArenaEdge/ArenaEdge";
import {useArenaNodeControls, useArenaEdgeControls} from "./Arena.controls";
import { 
    arrayToKey, 
    keyToArray, 
    getEdgesFromPositionKeys, 
    getAllAttackedPositionsKeys, 
    getEdgeEndPoints, 
    getArenaEdges
} from "./Arena.utils";

const Arena = ({
    soldierPoses,
    currentHoveredPosition
}) => {

    const { 
        arenaNodesColors,
        arenaNodesOpacity,
        arenaNodesIsDisplay,
    } = useArenaNodeControls()

    const {
        arenaEdgesColors,
        arenaEdgesOpacity,
        arenaEdgesIsDisplay,
        arenaEdgesLinewidth
    } = useArenaEdgeControls()

    const [attackedOnceNodes, setAttackedOnceNodes] = useState([])
    const [attackedTwiceNodes, setAttackedTwiceNodes] = useState([])
    const [attackZoneEdges, setAttackZoneEdges] = useState([])
    const [hoveredPositionEdges, setHoveredPositionEdges] = useState([])
    const [arenaEdges, setArenaEdges] = useState([])

    /**
     * Set the arena Edges whenever the attack zone edges changes
     */
    useEffect(() => {
        const allArenaEdges = getArenaEdges(attackZoneEdges)
        setArenaEdges(allArenaEdges)
    }, [attackZoneEdges])

    /**
     * When the hovered position changes, update the edges that are being hovered over
     */
    useEffect(() => {

        if (currentHoveredPosition) {
            const updatedHoveredPositionEdges = getEdgesFromPositionKeys([arrayToKey(currentHoveredPosition)])
            setHoveredPositionEdges(updatedHoveredPositionEdges)
        } else {
            setHoveredPositionEdges([])
        }
    }, [currentHoveredPosition])


    /**
     * When the soldierPoses change (i.e. their position and direction), update the attacked nodes
     */
    useEffect(() => {
        const [positionsAttackedOnceKeys, positionsAttackedMultipleKeys] = getAllAttackedPositionsKeys(soldierPoses)

        setAttackedOnceNodes(positionsAttackedOnceKeys)
        setAttackedTwiceNodes(positionsAttackedMultipleKeys)

    }, [soldierPoses])


    /**
     * When the attacked nodes change, update the attack zone edges
     */
    useEffect(() => {
        const attackZoneNodes = [...attackedOnceNodes, ...attackedTwiceNodes]

        const edgeNodes = getEdgesFromPositionKeys(attackZoneNodes)
        setAttackZoneEdges(edgeNodes)

    }, [attackedOnceNodes, attackedTwiceNodes])


    return (
        <>
            {attackedOnceNodes.map((node, index) => {

                const position = keyToArray(node);

                return (
                    <ArenaNode
                        key={index}
                        position={position}
                        color={arenaNodesColors.attackZoneSingle}
                        opacity={arenaNodesOpacity.attackZoneSingle}
                        isDisplay={arenaNodesIsDisplay.attackZoneSingle}
                    />
                );
            })}
            {attackedTwiceNodes.map((node, index) => {

                const position = keyToArray(node);

                return (
                    <ArenaNode
                        key={index}
                        position={position}
                        color={arenaNodesColors.attackZoneShared}
                        opacity={arenaNodesOpacity.attackZoneShared}
                        isDisplay={arenaNodesIsDisplay.attackZoneShared}
                    />
                );
            })}
            {attackZoneEdges.map((edge, index) => {
                const points = getEdgeEndPoints(keyToArray(edge[0]), keyToArray(edge[1]))
                
                return (
                    <ArenaEdge
                        key={index}
                        points={points}
                        color={arenaEdgesColors.attackZone}
                        linewidth={arenaEdgesLinewidth.attackZone}
                        opacity={arenaEdgesOpacity.attackZone}
                        isDisplay={arenaEdgesIsDisplay.attackZone}
                    />
                )
            })}
            {currentHoveredPosition && (
                <ArenaNode
                    position={currentHoveredPosition}
                    color={arenaNodesColors.hovered}
                    opacity={arenaNodesOpacity.hovered}
                    isDisplay={arenaNodesIsDisplay.hovered}
                />
            )}
            {hoveredPositionEdges.map((edge, index) => {
                const points = getEdgeEndPoints(keyToArray(edge[0]), keyToArray(edge[1]))
                
                return (
                    <ArenaEdge
                        key={index}
                        points={points}
                        color={arenaEdgesColors.hovered}
                        linewidth={arenaEdgesLinewidth.hovered}
                        opacity={arenaEdgesOpacity.hovered}
                        isDisplay={arenaEdgesIsDisplay.hovered}
                    />
                )
            })}
            {arenaEdges.map((edge, index) => {

                const points = getEdgeEndPoints(edge[0], edge[1])

                return (
                    <ArenaEdge
                        key={index}
                        points={points}
                        color='white'
                        linewidth={10}
                        opacity={0.3}
                        isDisplay={true}
                    />
                )
            })}
        </>
    )
}

export default Arena;
