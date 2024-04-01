import React, {useEffect, useState, useRef} from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import SelectionPanel from '../components/PanelScene/SelectionPanel/SelectionPanel';
import {useControls, useWatch , folder} from 'leva';

/**
 * Terminology:
 * Selection Panel: The panel that contains the move selectors and direction selectors.
 * Move Selector Panel: The panel that contains the move selectors.
 * Move Selector: The selector that allows the user to choose a move.
 * Direction Selector: The selector that allows the user to choose a direction.
 */

const PanelScene = () => {

    const [directionMap, setDirectionMap] = useState({
        face: '-z',
        left: '-x',
        right: '+x',
        up: '+y',
        down: '-y'
    });
    const [allowedPositions, setAllowedPositions] = useState([
        [1,1,1],
        [1,0,-1],
        [1,1,0],
        [0,0,-1],
    ])
    const [isPanelLocked, setIsPanelLocked] = useState(false);
    const [currentHoveredPose, setCurrentHoveredPose] = useState(null);
    const [currentSelectedPose, setCurrentSelectedPose] = useState(null);

    const { panelSize } = useControls('Selection Panel', {
        'Size Adjustments': folder({
            panelSize: {
                value: 250,
                min: 100,
                max: 500,
                step: 1
            }
        })
    });
    
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