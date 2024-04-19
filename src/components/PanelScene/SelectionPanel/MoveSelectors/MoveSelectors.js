import React from 'react';
import { Layer } from 'react-konva';
import MoveSelector from './MoveSelector';
import {isPositionInArray} from '../../../../utils/positionHelpers'
import useMoveSelectorsControls from './MoveSelectors.controls';
import { getRelativePosition } from '../SelectionPanel.utils';

const MoveSelectors = ({
    allowedPositions, 
    cardinalDirectionMap,
    isPanelLocked,
    directionSelectorSize, 
    moveSelectorSize, 
    selectorOffsetSize,
    onMoveSelectorsClick,
    onMoveSelectorsMouseEnter,
    onMoveSelectorsMouseLeave,
}) => {

    const { 
        moveSelectorDefaultColor, 
        moveSelectorHoveredColor,
        moveSelectorSelectedColor, 
        moveSelectorBlockedColor 
    } = useMoveSelectorsControls()

    const handleMouseEnter = (e) => {
        e.target.fill(moveSelectorHoveredColor);
        e.target.draw();
        const hoveredRelativePosition = e.target.name().split(',').map(Number)
        onMoveSelectorsMouseEnter(hoveredRelativePosition)
    };

    const handleMouseLeave = (e) => {
        e.target.fill(moveSelectorDefaultColor);
        e.target.draw();
        onMoveSelectorsMouseLeave()
    };

    const handleClick = (e) => {
        e.target.fill(moveSelectorSelectedColor);
        e.target.draw();
        const selectedPosition = e.target.name().split(',').map(Number)
        onMoveSelectorsClick(selectedPosition)
    };

    return (

        <Layer>
            {[...Array(3)].map((_, i) => (
            [...Array(3)].map((_, j) => {
                
                const [xOffset, yOffset] = [i - 1, j - 1]
                const relativePosition = getRelativePosition(xOffset, yOffset, cardinalDirectionMap)
                const isPositionAllowed = allowedPositions && isPositionInArray(relativePosition, allowedPositions) && !isPanelLocked

                return (
                    <MoveSelector
                        name={`${relativePosition}`}
                        key={`${i}-${j}`}
                        x={i * moveSelectorSize + directionSelectorSize + (i + 1) *selectorOffsetSize}
                        y={j * moveSelectorSize + directionSelectorSize + (j + 1) *selectorOffsetSize}
                        width={moveSelectorSize}
                        height={moveSelectorSize}
                        fill={isPositionAllowed ? moveSelectorDefaultColor : moveSelectorBlockedColor}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleClick}
                        isBlocked={!isPositionAllowed}
                    />
                )
            })
            ))}
        </Layer>

    );
};

export default MoveSelectors;