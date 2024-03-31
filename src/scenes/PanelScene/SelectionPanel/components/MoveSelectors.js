import React, {useEffect} from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';


const MoveSelectors = ({panelSize, directionSelectorSize, moveSelectorSize, selectorOffsetSize}) => {



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

        <Layer>
            {[...Array(3)].map((_, i) => (
            [...Array(3)].map((_, j) => (
                <Rect
                    key={`${i}-${j}`}
                    x={i * moveSelectorSize + directionSelectorSize + (i + 1) *selectorOffsetSize}
                    y={j * moveSelectorSize + directionSelectorSize + (j + 1) *selectorOffsetSize}
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

    );
};

export default MoveSelectors;