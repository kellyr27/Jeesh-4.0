import React, {useEffect} from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import SelectionPanel from './SelectionPanel/SelectionPanel';

/**
 * Terminology:
 * Selection Panel: The panel that contains the move selectors and direction selectors.
 * Move Selector Panel: The panel that contains the move selectors.
 * Move Selector: The selector that allows the user to choose a move.
 * Direction Selector: The selector that allows the user to choose a direction.
 * 
 */

//TODO: Make 250 a constant

const PanelScene = () => {


    return (
        <Stage width={250} height={250}>
            <SelectionPanel />
        </Stage>
    );
};

export default PanelScene;