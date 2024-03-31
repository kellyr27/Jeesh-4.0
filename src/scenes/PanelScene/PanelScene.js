import React, {useEffect, useState, useRef} from 'react';
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

    const directionMap = useRef({
        facing: '-z',
        left: '-x',
        right: '+x',
        up: '+y',
        down: '-y'
    });

    const allowedPositions = [
        [1,1,1],
        [1,0,-1],
        [1,1,0],
        [0,0,-1],
    ]

    return (
        <Stage width={250} height={250}>
            <SelectionPanel allowedPositions={allowedPositions} directionMap={directionMap} />
        </Stage>
    );
};

export default PanelScene;