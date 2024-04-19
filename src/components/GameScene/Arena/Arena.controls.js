import { useControls, folder } from 'leva';

const useArenaNodeControls = () => {
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
                'Hovered': 'yellow',
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
                'Attack Zone': 'black',
                'Border': 'white',
                'Hovered': 'yellow',
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
                'Hovered': 0.3,
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
                'Default': 1,
                'Attack Zone': 1,
                'Border': 1,
                'Hovered': 1,
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
                'Default': false,
                'Attack Zone': true,
                'Border': true,
                'Hovered': true,
            })
        })
    })
    const arenaEdgesIsDisplay = {
        default: arenaEdgesDefaultIsDisplay,
        attackZone: arenaEdgesAttackZoneIsDisplay,
        border: arenaEdgesBorderIsDisplay,
        hovered: arenaEdgesHoveredIsDisplay
    }

    const {
        'Attack Zone': arenaEdgesAttackZoneLineWidth,
        'Hovered': arenaEdgesHoveredLineWidth,
    } = useControls('Arena', {
        'Arena Edges': folder({
            'Is Display': folder({
                'Default': 1,
                'Attack Zone': 15,
                'Border': 1,
                'Hovered': 6,
            })
        })
    })
    const arenaEdgesLinewidth = {
        attackZone: arenaEdgesAttackZoneLineWidth,
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