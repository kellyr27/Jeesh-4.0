import React, {useEffect} from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import {useControls, folder} from 'leva';
import { addArrays } from '../../../../utils/arrayHelpers';
import MoveSelector from './MoveSelector';
import {getRelativeDirectionArray} from '../../../../utils/directionHelpers';
import { checkIfPositionInArray } from '../../../../utils/poseHelpers';

const getRelativePosition = (xOffset, yOffset, directionMap) => {
    if (xOffset === -1 && yOffset === -1) {
        return addArrays(getRelativeDirectionArray(directionMap.left), getRelativeDirectionArray(directionMap.up), getRelativeDirectionArray(directionMap.face))
    } else if (xOffset === 0 && yOffset === -1) {
        return addArrays(getRelativeDirectionArray(directionMap.up), getRelativeDirectionArray(directionMap.face))
    } else if (xOffset === 1 && yOffset === -1) {
        return addArrays(getRelativeDirectionArray(directionMap.right), getRelativeDirectionArray(directionMap.up), getRelativeDirectionArray(directionMap.face))
    } else if (xOffset === -1 && yOffset === 0) {
        return addArrays(getRelativeDirectionArray(directionMap.left), getRelativeDirectionArray(directionMap.face))
    } else if (xOffset === 0 && yOffset === 0) {
        return addArrays(getRelativeDirectionArray(directionMap.face))
    } else if (xOffset === 1 && yOffset === 0) {
        return addArrays(getRelativeDirectionArray(directionMap.right), getRelativeDirectionArray(directionMap.face))
    } else if (xOffset === -1 && yOffset === 1) {
        return addArrays(getRelativeDirectionArray(directionMap.left), getRelativeDirectionArray(directionMap.down), getRelativeDirectionArray(directionMap.face))
    } else if (xOffset === 0 && yOffset === 1) {
        return addArrays(getRelativeDirectionArray(directionMap.down), getRelativeDirectionArray(directionMap.face))
    } else if (xOffset === 1 && yOffset === 1) {
        return addArrays(getRelativeDirectionArray(directionMap.right), getRelativeDirectionArray(directionMap.down), getRelativeDirectionArray(directionMap.face))
    }
}

const MoveSelectors = ({
    allowedPositions, 
    directionMap, 
    setDirectionMap, 
    isPanelLocked,
    currentHoveredPose,
    setCurrentHoveredPose,
    currentSelectedPose,
    setCurrentSelectedPose,
    panelSize, 
    directionSelectorSize, 
    moveSelectorSize, 
    selectorOffsetSize
}) => {

    const { moveSelectorDefaultColor, moveSelectorHoveredColor, moveSelectorSelectedColor, moveSelectorBlockedColor } = useControls('Selection Panel', {
        'Colors': folder({
            moveSelectorDefaultColor: '#00D2FF',
            moveSelectorHoveredColor: '#FF00D2',
            moveSelectorSelectedColor: '#D200FF',
            moveSelectorBlockedColor: '#FFD200'
        })
    })

    const handleMouseEnter = (e) => {
        e.target.fill(moveSelectorHoveredColor);
        e.target.draw();

        const hoveredPosition = e.target.name().split(',').map(Number)
        setCurrentHoveredPose({
            position: hoveredPosition,
            direction: directionMap.face
        })
    };

    const handleMouseLeave = (e) => {
        e.target.fill(moveSelectorDefaultColor);
        e.target.draw();

        setCurrentHoveredPose(null)
    };

    const handleClick = (e) => {
        e.target.fill(moveSelectorSelectedColor);
        e.target.draw();

        const selectedPosition = e.target.name().split(',').map(Number)
        setCurrentSelectedPose({
            position: selectedPosition,
            direction: directionMap.face
        })
    };

    return (

        <Layer>
            {[...Array(3)].map((_, i) => (
            [...Array(3)].map((_, j) => {
                
                const [xOffset, yOffset] = [i - 1, j - 1]
                const relativePosition = getRelativePosition(xOffset, yOffset, directionMap)
                const isPositionAllowed = checkIfPositionInArray(relativePosition, allowedPositions) && !isPanelLocked

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