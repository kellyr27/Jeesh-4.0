import React, { useRef, useEffect } from 'react';
import ArenaNodes from './ArenaNodes/ArenaNodes';
import { useControls, folder } from 'leva';

const Arena = ({
    soldier1Position,
    setSoldier1Position,
    soldier1Direction,
    setSoldier1Direction,
}) => {

    const {
        'Default': arenaNodesDefaultColor,
        'Attack Zone - Army 1': arenaNodesAttackZoneArmy1Color,
        'Attack Zone - Army 2': arenaNodesAttackZoneArmy2Color,
        'Attack Zone - Shared': arenaNodesAttackZoneSharedColor,
        'Door': arenaNodesDoorColor,
        'Hovered': arenaNodesHoveredColor,
    } = useControls('Arena', {
        'Arena Nodes': folder({
            'Colors': folder({
                'Default': '#ff0000',
                'Attack Zone - Army 1': '#0000ff',
                'Attack Zone - Army 2': '#800080',
                'Attack Zone - Shared': '#ffff00',
                'Door': '#F98B88',
                'Hovered': '#ffffff',
            })
        })
    })

    const {
        'Default': arenaNodesDefaultOpacity,
        'Attack Zone - Army 1': arenaNodesAttackZoneArmy1Opacity,
        'Attack Zone - Army 2': arenaNodesAttackZoneArmy2Opacity,
        'Attack Zone - Shared': arenaNodesAttackZoneSharedOpacity,
        'Door': arenaNodesDoorOpacity,
        'Hovered': arenaNodesHoveredOpacity,
    } = useControls('Arena', {
        'Arena Nodes': folder({
            'Opacities': folder({
                'Default': 0.01,
                'Attack Zone - Army 1': 0.35,
                'Attack Zone - Army 2': 0.35,
                'Attack Zone - Shared': 0.35,
                'Door': 0.6,
                'Hovered': 0.1,
            })
        })
    });
    
    const {
        'Default': arenaNodesDefaultDisplay,
        'Attack Zone - Army 1': arenaNodesAttackZoneArmy1Display,
        'Attack Zone - Army 2': arenaNodesAttackZoneArmy2Display,
        'Attack Zone - Shared': arenaNodesAttackZoneSharedDisplay,
        'Door': arenaNodesDoorDisplay,
        'Hovered': arenaNodesHoveredDisplay,
    } = useControls('Arena', {
        'Arena Nodes': folder({
            'Display': folder({
                'Default': true,
                'Attack Zone - Army 1': true,
                'Attack Zone - Army 2': true,
                'Attack Zone - Shared': true,
                'Door': true,
                'Hovered': true,
            })
        })
    });


    return (
        <>
            <ArenaNodes
                defaultColor={arenaNodesDefaultColor}
                attackZoneArmy1Color={arenaNodesAttackZoneArmy1Color}
                attackZoneArmy2Color={arenaNodesAttackZoneArmy2Color}
                attackZoneSharedColor={arenaNodesAttackZoneSharedColor}
                doorColor={arenaNodesDoorColor}
                hoveredColor={arenaNodesHoveredColor}
                defaultOpacity={arenaNodesDefaultOpacity}
                attackZoneArmy1Opacity={arenaNodesAttackZoneArmy1Opacity}
                attackZoneArmy2Opacity={arenaNodesAttackZoneArmy2Opacity}
                attackZoneSharedOpacity={arenaNodesAttackZoneSharedOpacity}
                doorOpacity={arenaNodesDoorOpacity}
                hoveredOpacity={arenaNodesHoveredOpacity}
                defaultDisplay={arenaNodesDefaultDisplay}
                attackZoneArmy1Display={arenaNodesAttackZoneArmy1Display}
                attackZoneArmy2Display={arenaNodesAttackZoneArmy2Display}
                attackZoneSharedDisplay={arenaNodesAttackZoneSharedDisplay}
                doorDisplay={arenaNodesDoorDisplay}
                hoveredDisplay={arenaNodesHoveredDisplay}
                soldier1Position={soldier1Position}
                setSoldier1Position={setSoldier1Position}
                soldier1Direction={soldier1Direction}
                setSoldier1Direction={setSoldier1Direction}
            />
        </>
    );
};

export default Arena;