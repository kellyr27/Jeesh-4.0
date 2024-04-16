import React, {useState, useEffect} from "react";
import ArenaNode from "./ArenaNodes/ArenaNode";
import { getAllAttackedPositionsKeys, getEdgeEndPoints } from '../../../utils/displayHelpers';
import ArenaEdge from "./ArenaEdges/ArenaEdge";
import useArenaNodeControls from "./Arena.controls";
import { arrayToKey, keyToArray, getEdgesFromPositionKeys } from "./Arena.utils";
import { ARENA_LENGTH } from "../../../globals";

const Arena = ({
    soldierPoses,
    currentHoveredPosition
}) => {

    const { 
        arenaNodesColors,
        arenaEdgesColors,
        arenaNodesOpacity,
        arenaEdgesOpacity,
        arenaNodesIsDisplay,
        arenaEdgesIsDisplay,
        // arenaEdgesLineWidth
    } = useArenaNodeControls()

    const [attackedOnceNodes, setAttackedOnceNodes] = useState([])
    const [attackedTwiceNodes, setAttackedTwiceNodes] = useState([])
    const [attackZoneEdges, setAttackZoneEdges] = useState([])
    const [hoveredPositionEdges, setHoveredPositionEdges] = useState([])
    const [arenaEdgePoints, setArenaEdgePoints] = useState([])

    /**
     * 
     */

    /**
     * Set the arena Edges
     */
    useEffect(() => {

        const startEdge = 0 - 1/2
        const endEdge = ARENA_LENGTH - 1/2

        const edgePoints = [
            [
                [startEdge, startEdge, startEdge],
                [endEdge, startEdge, startEdge]
            ],
            [
                [startEdge, startEdge, startEdge],
                [startEdge, endEdge, startEdge]
            ],
            [
                [startEdge, startEdge, startEdge],
                [startEdge, startEdge, endEdge]
            ],
            [
                [endEdge, startEdge, startEdge],
                [endEdge, endEdge, startEdge]
            ],
            [
                [endEdge, startEdge, startEdge],
                [endEdge, startEdge, endEdge]
            ],
            [
                [startEdge, endEdge, startEdge],
                [endEdge, endEdge, startEdge]
            ],
            [
                [startEdge, endEdge, startEdge],
                [startEdge, endEdge, endEdge]
            ],
            [
                [startEdge, startEdge, endEdge],
                [endEdge, startEdge, endEdge]
            ],
            [
                [startEdge, startEdge, endEdge],
                [startEdge, endEdge, endEdge]
            ],
            [
                [endEdge, endEdge, startEdge],
                [endEdge, endEdge, endEdge]
            ],
            [
                [startEdge, endEdge, endEdge],
                [endEdge, endEdge, endEdge]
            ],
            [
                [endEdge, startEdge, endEdge],
                [endEdge, endEdge, endEdge]
            ]
        ]

        setArenaEdgePoints(edgePoints)
    }, [])

    /**
     * When the hovered position changes, update the edges that are being hovered over
     */
    useEffect(() => {

        if (currentHoveredPosition) {
            //TODO: Rename this function to fit
            const edgeNodes = getEdgesFromPositionKeys([arrayToKey(currentHoveredPosition)])

            setHoveredPositionEdges(edgeNodes)
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

                const position = node.split('_').map(Number);

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

                const position = node.split('_').map(Number);

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
                        linewidth={6}
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
                        linewidth={6}
                        opacity={arenaEdgesOpacity.hovered}
                        isDisplay={arenaEdgesIsDisplay.hovered}
                    />
                )
            })}
            {arenaEdgePoints.map((edgePoints, index) => {

                return (
                    <ArenaEdge
                        key={index}
                        points={edgePoints}
                        color='white'
                        linewidth={10}
                        opacity={1}
                        isDisplay={true}
                    />
                )
            })}
        </>
    )
}

export default Arena;
