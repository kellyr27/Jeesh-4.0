import React, {useEffect} from 'react';
import { Stage, Layer, Rect } from 'react-konva';

/**
 * Terminology:
 * Selection Panel: The panel that contains the move selectors and direction selectors.
 * Move Selector Panel: The panel that contains the move selectors.
 * Move Selector: The selector that allows the user to choose a move.
 * Direction Selector: The selector that allows the user to choose a direction.
 * 
 */

const PanelScene = () => {




    const [panelSize, setPanelSize] = React.useState(250)
    const [directionSelectorSize, setDirectionSelectorSize] = React.useState(55)
    const [moveSelectorSize, setMoveSelectorSize] = React.useState(40)
    const [selectorOffsetSize, setSelectorOffsetSize] = React.useState(5)


    const handleMouseEnter = (e) => {
        // Change the color of the square when the mouse enters
        e.target.fill('green');
        e.target.draw();
    };

    const handleMouseLeave = (e) => {
        // Change the color back when the mouse leaves
        e.target.fill('blue');
        e.target.draw();
    };

    const handleClick = (e) => {
        // Do something when the square is clicked
        e.target.fill('purple');
        e.target.draw();
        console.log('Square clicked!');
    };

    return (
        <Stage width={panelSize} height={panelSize}>
            <Layer>
                {[...Array(3)].map((_, i) => (
                [...Array(3)].map((_, j) => (
                    <Rect
                        key={`${i}-${j}`}
                        x={i * moveSelectorSize + directionSelectorSize + i *selectorOffsetSize}
                        y={j * moveSelectorSize + directionSelectorSize + j *selectorOffsetSize}
                        width={moveSelectorSize}
                        height={moveSelectorSize}
                        fill="blue"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleClick}
                    />
                ))
                ))}
            </Layer>
        </Stage>
    );
};

    export default PanelScene;