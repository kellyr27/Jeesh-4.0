import React, {useEffect, useRef} from 'react';
import { Stage, Layer, Rect, Line, Text } from 'react-konva';
import {useControls, folder} from 'leva';

const PanelText = ({text, x, y, isPanelLocked}) => {
    const textRef = useRef();

    /**
     * Adjust the textSize so it is perfectly in the center
     */
    useEffect(() => {
        if (textRef.current) {
            const textWidth = textRef.current.width();
            const textHeight = textRef.current.height();

            textRef.current.setAttrs({
                x: x - textWidth / 2,
                y: y - textHeight / 2
            });
        }
    }, [x, y]);

    return (
        <Text
            text={text}
            x={x}
            y={y}
            fontSize={15}
            fill='black'
            align='center'
            verticalAlign='middle'
            ref={textRef}
            opacity={!isPanelLocked? 0.7: 0.3}
        />
    );
}

//TODO: When selected bold the text

const PanelTexts = ({
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
    const texts = [
        { text: directionMap.face, x: panelSize / 2, y: panelSize / 2 },
        { text: directionMap.left, x: directionSelectorSize / 2, y: panelSize / 2 },
        { text: directionMap.right, x: panelSize - directionSelectorSize / 2, y: panelSize / 2 },
        { text: directionMap.up, x: panelSize / 2, y: directionSelectorSize / 2 },
        { text: directionMap.down, x: panelSize / 2, y: panelSize - directionSelectorSize / 2 },
    ];

    return (
        <Layer listening={false}>
            {texts.map(({ text, x, y }, index) => (
                <PanelText key={index} text={text} x={x} y={y} isPanelLocked={isPanelLocked} />
            ))}
        </Layer>
    );
};

export default PanelTexts;