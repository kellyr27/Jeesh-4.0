import React, {useEffect, useState} from 'react';
import { Stage } from 'react-konva';
import SelectionPanel from '../components/PanelScene/SelectionPanel/SelectionPanel';

/**
 * Terminology:
 * Selection Panel: The panel that contains the move selectors and direction selectors.
 * Move Selector Panel: The panel that contains the move selectors.
 * Move Selector: The selector that allows the user to choose a move.
 * Direction Selector: The selector that allows the user to choose a direction.
 */

const PanelScene = ({
    panelSize,
    allowedPositions,
    isPanelLocked,
}) => {
    
    const [selectorSizes, setSelectorSizes] = useState({
        direction: 40,
        move: 50,
        offset: 5
    });
    
    // Update the size of the components when the panel size changes
    useEffect(() => {
        setSelectorSizes({
            direction: panelSize * 0.16,
            move: panelSize * 0.2,
            offset: panelSize * 0.02
        });
    }, [panelSize]);


    const handleMoveSelected = (selectedPosition) => {
        console.log('Move has been selected. Lock panel', selectedPosition)
    }

    const handleMoveHovered = (hoveredPosition) => {
        console.log('Move is hovered', hoveredPosition)
    }

    return (
        <Stage width={panelSize} height={panelSize}>
            <SelectionPanel 
                allowedPositions={allowedPositions} 
                isPanelLocked={isPanelLocked}
                panelSize={panelSize}
                selectorSizes={selectorSizes}
                onMoveSelected={handleMoveSelected}
                onMoveHovered={handleMoveHovered}
                initialCardinalDirectionMap={{
                    face: '+z',
                    left: '-x',
                    right: '+x',
                    up: '+y',
                    down: '-y'
                }}
            />
        </Stage>
    );
};

export default PanelScene;