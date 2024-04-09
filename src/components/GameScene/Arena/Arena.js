import React, { useRef, useEffect } from 'react';
import ArenaNodes from './ArenaNodes/ArenaNodes';
import { useControls, folder } from 'leva';
import ArenaEdges from './ArenaEdges/ArenaEdges';

const Arena = ({
    soldiers
}) => {

    const {
        'Default': arenaNodesDefaultColor,
        'Attack Zone - Single': arenaNodesAttackZoneSingleColor,
        'Attack Zone - Shared': arenaNodesAttackZoneSharedColor,
        'Hovered': arenaNodesHoveredColor,
    } = useControls('Arena', {
        'Arena Nodes': folder({
            'Colors': folder({
                'Default': '#ff0000',
                'Attack Zone - Single': 'red',
                'Attack Zone - Shared': 'blue',
                'Hovered': '#ffffff',
            })
        })
    })
    const arenaNodesColors = {
        default: arenaNodesDefaultColor,
        attackZoneSingle: arenaNodesAttackZoneSingleColor,
        attackZoneShared: arenaNodesAttackZoneSharedColor,
        hovered: arenaNodesHoveredColor
    }

    const {
        'Default': arenaEdgesDefaultColor,
        'Attack Zone': arenaEdgesAttackZoneColor,
        'Border': arenaEdgesBorderColor,
        'Hovered': arenaEdgesHoveredColor,
    } = useControls('Arena', {
        'Arena Edges': folder({
            'Colors': folder({
                'Default': '#ff0000',
                'Attack Zone': 'red',
                'Border': 'white',
                'Hovered': '#ffffff',
            })
        })
    })
    const arenaEdgesColors = {
        default: arenaEdgesDefaultColor,
        attackZone: arenaEdgesAttackZoneColor,
        border: arenaEdgesBorderColor,
        hovered: arenaEdgesHoveredColor
    }



    const {
        'Default': arenaNodesDefaultOpacity,
        'Attack Zone - Single': arenaNodesAttackZoneSingleOpacity,
        'Attack Zone - Shared': arenaNodesAttackZoneSharedOpacity,
        'Hovered': arenaNodesHoveredOpacity,
    } = useControls('Arena', {
        'Arena Nodes': folder({
            'Opacities': folder({
                'Default': 0.01,
                'Attack Zone - Single': 0.35,
                'Attack Zone - Shared': 0.35,
                'Hovered': 0.1,
            })
        })
    })
    const arenaNodesOpacity = {
        default: arenaNodesDefaultOpacity,
        attackZoneSingle: arenaNodesAttackZoneSingleOpacity,
        attackZoneShared: arenaNodesAttackZoneSharedOpacity,
        hovered: arenaNodesHoveredOpacity
    }

    const {
        'Default': arenaEdgesDefaultOpacity,
        'Attack Zone': arenaEdgesAttackZoneOpacity,
        'Border': arenaEdgesBorderOpacity,
        'Hovered': arenaEdgesHoveredOpacity,
    } = useControls('Arena', {
        'Arena Edges': folder({
            'Opacity': folder({
                'Default': '#ff0000',
                'Attack Zone': 'red',
                'Border': 'white',
                'Hovered': '#ffffff',
            })
        })
    })
    const arenaEdgesOpacity = {
        default: arenaEdgesDefaultOpacity,
        attackZone: arenaEdgesAttackZoneOpacity,
        border: arenaEdgesBorderOpacity,
        hovered: arenaEdgesHoveredOpacity
    }

    
    const {
        'Default': arenaNodesDefaultIsDisplay,
        'Attack Zone - Single': arenaNodesAttackZoneSingleIsDisplay,
        'Attack Zone - Shared': arenaNodesAttackZoneSharedIsDisplay,
        'Hovered': arenaNodesHoveredIsDisplay,
    } = useControls('Arena', {
        'Arena Nodes': folder({
            'Is Display': folder({
                'Default': false,
                'Attack Zone - Single': true,
                'Attack Zone - Shared': true,
                'Hovered': true,
            })
        })
    })
    const arenaNodesIsDisplay = {
        default: arenaNodesDefaultIsDisplay,
        attackZoneSingle: arenaNodesAttackZoneSingleIsDisplay,
        attackZoneShared: arenaNodesAttackZoneSharedIsDisplay,
        hovered: arenaNodesHoveredIsDisplay
    }

    const {
        'Default': arenaEdgesDefaultIsDisplay,
        'Attack Zone': arenaEdgesAttackZoneIsDisplay,
        'Border': arenaEdgesBorderIsDisplay,
        'Hovered': arenaEdgesHoveredIsDisplay,
    } = useControls('Arena', {
        'Arena Edges': folder({
            'Is Display': folder({
                'Default': '#ff0000',
                'Attack Zone': 'red',
                'Border': 'white',
                'Hovered': '#ffffff',
            })
        })
    })
    const arenaEdgesIsDisplay = {
        default: arenaEdgesDefaultIsDisplay,
        attackZone: arenaEdgesAttackZoneIsDisplay,
        border: arenaEdgesBorderIsDisplay,
        hovered: arenaEdgesHoveredIsDisplay
    }


    return (
        <>
            <ArenaNodes
                arenaNodesColors={arenaNodesColors}
                arenaNodesOpacity={arenaNodesOpacity}
                arenaNodesIsDisplay={arenaNodesIsDisplay}
                soldiers={soldiers}
            />
            {/* <ArenaEdges
                arenaEdgesColors={arenaEdgesColors}
                arenaEdgesOpacity={arenaEdgesOpacity}
                arenaEdgesIsDisplay={arenaEdgesIsDisplay}
            /> */}
        </>

    );
};

export default Arena;