import React, {useEffect, useState} from 'react';
import { Layer, Line } from 'react-konva';
import {useControls, folder} from 'leva';

const DirectionSelectors = ({
    panelSize, 
    directionSelectorSize, 
    selectorOffsetSize, 
    isPanelLocked, 
    onDirectionClick
}) => {

    const { directionSelectiorDefaultColor, directionSelectiorHoveredColor, directionSelectiorSelectedColor, directionSelectiorBlockedColor } = useControls('Selection Panel', {
        'Colors': folder({
            directionSelectiorDefaultColor: '#00D2FF',
            directionSelectiorHoveredColor: '#FF00D2',
            directionSelectiorSelectedColor: '#D200FF',
            directionSelectiorBlockedColor: '#FFD200'
        })
    })


    const [halfSelectorOffsetSize, setHalfSelectorOffsetSize] = useState(selectorOffsetSize / 2)

    /**
     * Re-calculate the halfSelectorOffsetSize when the selectorOffsetSize changes
     */
    useEffect (() => {
        setHalfSelectorOffsetSize(selectorOffsetSize / 2)
    }, [selectorOffsetSize])

    // Change the color of the square when the mouse enters
    const handleMouseEnter = (e) => {
        e.target.fill(directionSelectiorHoveredColor);
        e.target.draw();
    };

    // Change the color back when the mouse leaves
    const handleMouseLeave = (e) => {
        e.target.fill(directionSelectiorDefaultColor);
        e.target.draw();
    };

    // Change the color of the square when it is clicked
    const handleClick = ( e) => {
        e.target.fill(directionSelectiorSelectedColor);
        e.target.draw();
        const directionClicked = e.target.name()

        // Call the onDirectionClick function with the clicked direction
        onDirectionClick(directionClicked)
    };

    const directionSelectors = {
        'up': {
            points: [
                [0 + halfSelectorOffsetSize, 0 - halfSelectorOffsetSize],
                [directionSelectorSize + halfSelectorOffsetSize, directionSelectorSize - halfSelectorOffsetSize],
                [panelSize - directionSelectorSize - halfSelectorOffsetSize, directionSelectorSize - halfSelectorOffsetSize],
                [panelSize - halfSelectorOffsetSize, 0 - halfSelectorOffsetSize]
            ]
        },
        'down': {
            points: [
                [0 + halfSelectorOffsetSize, panelSize + halfSelectorOffsetSize],
                [directionSelectorSize + halfSelectorOffsetSize, panelSize - directionSelectorSize + halfSelectorOffsetSize],
                [panelSize - directionSelectorSize - halfSelectorOffsetSize, panelSize - directionSelectorSize + halfSelectorOffsetSize],
                [panelSize - halfSelectorOffsetSize, panelSize + halfSelectorOffsetSize]
            ]
        },
        'left': {
            points: [
                [0 - halfSelectorOffsetSize, 0 + halfSelectorOffsetSize],
                [directionSelectorSize - halfSelectorOffsetSize, directionSelectorSize + halfSelectorOffsetSize],
                [directionSelectorSize - halfSelectorOffsetSize, panelSize - directionSelectorSize - halfSelectorOffsetSize],
                [0 - halfSelectorOffsetSize, panelSize - halfSelectorOffsetSize]
            ]
        },
        'right': {
            points: [
                [panelSize + halfSelectorOffsetSize, 0 + halfSelectorOffsetSize],
                [panelSize - directionSelectorSize + halfSelectorOffsetSize, directionSelectorSize + halfSelectorOffsetSize],
                [panelSize - directionSelectorSize + halfSelectorOffsetSize, panelSize - directionSelectorSize - halfSelectorOffsetSize],
                [panelSize + halfSelectorOffsetSize, panelSize - halfSelectorOffsetSize]
            ]
        }
    }

    return (
        <Layer>
            {['up', 'down', 'left', 'right'].map(direction => (
                <Line
                    name={direction}
                    key={direction}
                    points={directionSelectors[direction].points.flat()}
                    fill={!isPanelLocked ? directionSelectiorDefaultColor: directionSelectiorBlockedColor}
                    opacity={!isPanelLocked ? 0.8 : 0.4}
                    onMouseEnter={!isPanelLocked ? handleMouseEnter: null}
                    onMouseLeave={!isPanelLocked ? handleMouseLeave: null }
                    onClick={!isPanelLocked ? handleClick: null}
                    closed
                />
            ))}
        </Layer>
    );
};

export default DirectionSelectors;