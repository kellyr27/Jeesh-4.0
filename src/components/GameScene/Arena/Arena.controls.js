import { useControls, folder } from 'leva';

const useArenaNodeControls = () => {
    const {
        'Attack Zone - Single': arenaNodesAttackZoneSingleColor,
        'Attack Zone - Shared': arenaNodesAttackZoneSharedColor,
        'Hovered': arenaNodesHoveredColor,
    } = useControls('Arena', {
        'Arena Nodes': folder({
            'Colors': folder({
                'Attack Zone - Single': 'red',
                'Attack Zone - Shared': 'blue',
                'Hovered': 'yellow',
            })
        })
    })
    const arenaNodesColors = {
        attackZoneSingle: arenaNodesAttackZoneSingleColor,
        attackZoneShared: arenaNodesAttackZoneSharedColor,
        hovered: arenaNodesHoveredColor
    }

    const {
        'Attack Zone': arenaEdgesAttackZoneColor,
        'Border': arenaEdgesBorderColor,
        'Hovered': arenaEdgesHoveredColor,
    } = useControls('Arena', {
        'Arena Edges': folder({
            'Colors': folder({
                'Attack Zone': 'black',
                'Border': 'white',
                'Hovered': 'yellow',
            })
        })
    })
    const arenaEdgesColors = {
        attackZone: arenaEdgesAttackZoneColor,
        border: arenaEdgesBorderColor,
        hovered: arenaEdgesHoveredColor
    }



    const {
        'Attack Zone - Single': arenaNodesAttackZoneSingleOpacity,
        'Attack Zone - Shared': arenaNodesAttackZoneSharedOpacity,
        'Hovered': arenaNodesHoveredOpacity,
    } = useControls('Arena', {
        'Arena Nodes': folder({
            'Opacities': folder({
                'Attack Zone - Single': 0.35,
                'Attack Zone - Shared': 0.35,
                'Hovered': 0.3,
            })
        })
    })
    const arenaNodesOpacity = {
        attackZoneSingle: arenaNodesAttackZoneSingleOpacity,
        attackZoneShared: arenaNodesAttackZoneSharedOpacity,
        hovered: arenaNodesHoveredOpacity
    }

    const {
        'Attack Zone': arenaEdgesAttackZoneOpacity,
        'Border': arenaEdgesBorderOpacity,
        'Hovered': arenaEdgesHoveredOpacity,
    } = useControls('Arena', {
        'Arena Edges': folder({
            'Opacity': folder({
                'Attack Zone': 1,
                'Border': 1,
                'Hovered': 1,
            })
        })
    })
    const arenaEdgesOpacity = {
        attackZone: arenaEdgesAttackZoneOpacity,
        border: arenaEdgesBorderOpacity,
        hovered: arenaEdgesHoveredOpacity
    }

    
    const {
        'Attack Zone - Single': arenaNodesAttackZoneSingleIsDisplay,
        'Attack Zone - Shared': arenaNodesAttackZoneSharedIsDisplay,
        'Hovered': arenaNodesHoveredIsDisplay,
    } = useControls('Arena', {
        'Arena Nodes': folder({
            'Is Display': folder({
                'Attack Zone - Single': true,
                'Attack Zone - Shared': true,
                'Hovered': true,
            })
        })
    })
    const arenaNodesIsDisplay = {
        attackZoneSingle: arenaNodesAttackZoneSingleIsDisplay,
        attackZoneShared: arenaNodesAttackZoneSharedIsDisplay,
        hovered: arenaNodesHoveredIsDisplay
    }

    const {
        'Attack Zone': arenaEdgesAttackZoneIsDisplay,
        'Border': arenaEdgesBorderIsDisplay,
        'Hovered': arenaEdgesHoveredIsDisplay,
    } = useControls('Arena', {
        'Arena Edges': folder({
            'Is Display': folder({
                'Attack Zone': true,
                'Border': true,
                'Hovered': true,
            })
        })
    })
    const arenaEdgesIsDisplay = {
        attackZone: arenaEdgesAttackZoneIsDisplay,
        border: arenaEdgesBorderIsDisplay,
        hovered: arenaEdgesHoveredIsDisplay
    }

    const {
        'Attack Zone': arenaEdgesAttackZoneLineWidth,
        'Border': arenaEdgesBorderLineWidth,
        'Hovered': arenaEdgesHoveredLineWidth,
    } = useControls('Arena', {
        'Arena Edges': folder({
            'Is Display': folder({
                'Attack Zone': 15,
                'Border': 1,
                'Hovered': 6,
            })
        })
    })
    const arenaEdgesLinewidth = {
        attackZone: arenaEdgesAttackZoneLineWidth,
        border: arenaEdgesBorderLineWidth,
        hovered: arenaEdgesHoveredLineWidth
    }

    return {
        arenaNodesColors,
        arenaEdgesColors,
        arenaNodesOpacity,
        arenaEdgesOpacity,
        arenaNodesIsDisplay,
        arenaEdgesIsDisplay,
        arenaEdgesLinewidth
    }
}

export default useArenaNodeControls;