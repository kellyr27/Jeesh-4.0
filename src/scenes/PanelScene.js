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
    setAllowedPositions, 
    isPanelLocked, 
    setIsPanelLocked,
    currentHoveredPose, 
    setCurrentHoveredPose,
    currentSelectedPose, 
    setCurrentSelectedPose,
    directionMap, 
    setDirectionMap
}) => {
    
    const [directionSelectorSize, setDirectionSelectorSize] = useState(40);
    const [moveSelectorSize, setMoveSelectorSize] = useState(50);
    const [selectorOffsetSize, setSelectorOffsetSize] = useState(5);

    // Update the size of the components when the panel size changes
    useEffect(() => {
        setDirectionSelectorSize(panelSize * 0.16)
        setMoveSelectorSize(panelSize * 0.2)
        setSelectorOffsetSize(panelSize * 0.02)
    }, [panelSize]);

    return (
        <Stage width={panelSize} height={panelSize}>
            <SelectionPanel 
                allowedPositions={allowedPositions} 
                directionMap={directionMap}
                setDirectionMap={setDirectionMap}
                isPanelLocked={isPanelLocked} 
                currentHoveredPose={currentHoveredPose}
                setCurrentHoveredPose={setCurrentHoveredPose} 
                currentSelectedPose={currentSelectedPose}
                setCurrentSelectedPose={setCurrentSelectedPose}
                panelSize={panelSize}
                directionSelectorSize={directionSelectorSize}
                moveSelectorSize={moveSelectorSize}
                selectorOffsetSize={selectorOffsetSize}
            />
        </Stage>
    );
};

export default PanelScene;