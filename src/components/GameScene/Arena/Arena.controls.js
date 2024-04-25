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
        'Attack Zone - Single': arenaNodesAttackZoneSingleOpacity,
        'Attack Zone - Shared': arenaNodesAttackZoneSharedOpacity,
        'Hovered': arenaNodesHoveredOpacity,
    } = useControls('Arena', {
        'Arena Nodes': folder({
            'Opacities': folder({
                'Attack Zone - Single':  {
                    value: 0.35,
                    min: 0,
                    max: 1
                },
                'Attack Zone - Shared': {
                    value: 0.35,
                    min: 0,
                    max: 1
                },
                'Hovered': {
                    value: 0.3,
                    min: 0,
                    max: 1
                },
            })
        })
    })

    const arenaNodesOpacity = {
        attackZoneSingle: arenaNodesAttackZoneSingleOpacity,
        attackZoneShared: arenaNodesAttackZoneSharedOpacity,
        hovered: arenaNodesHoveredOpacity
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

    return {
        arenaNodesColors,
        arenaNodesOpacity,
        arenaNodesIsDisplay,
    }
}

const useArenaEdgeControls = () => {

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
        'Attack Zone': arenaEdgesAttackZoneOpacity,
        'Border': arenaEdgesBorderOpacity,
        'Hovered': arenaEdgesHoveredOpacity,
    } = useControls('Arena', {
        'Arena Edges': folder({
            'Opacity': folder({
                'Attack Zone': { value: 1, min: 0, max: 1 },
                'Border': { value: 1, min: 0, max: 1 },
                'Hovered': { value: 1, min: 0, max: 1 },
            })
        })
    })
    const arenaEdgesOpacity = {
        attackZone: arenaEdgesAttackZoneOpacity,
        border: arenaEdgesBorderOpacity,
        hovered: arenaEdgesHoveredOpacity
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
            'Linewidth': folder({
                'Attack Zone': { value: 15, min: 0, max: 20 },
                'Border': { value: 10, min: 0, max: 20 },
                'Hovered': { value: 6, min: 0, max: 20 },
            })
        })
    })
    const arenaEdgesLinewidth = {
        attackZone: arenaEdgesAttackZoneLineWidth,
        border: arenaEdgesBorderLineWidth,
        hovered: arenaEdgesHoveredLineWidth
    }

    return {
        arenaEdgesColors,
        arenaEdgesOpacity,
        arenaEdgesIsDisplay,
        arenaEdgesLinewidth
    }
}

export {useArenaNodeControls, useArenaEdgeControls};