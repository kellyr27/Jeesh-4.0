import React from 'react';
import { Layer } from 'react-konva';
import PanelText from './PanelText';

const PanelTexts = ({
    cardinalDirectionMap, 
    isPanelLocked,
    panelSize, 
    directionSelectorSize
}) => {

    /**
     * `textElements` is an array of objects, where each object represents a text element on the panel.
     * Each text element has a `text` property (the text to be displayed), and `x` and `y` properties
     * (the coordinates of the text on the panel).
     */
    const textElements = [
        { text: cardinalDirectionMap.face, x: panelSize / 2, y: panelSize / 2 },
        { text: cardinalDirectionMap.left, x: directionSelectorSize / 2, y: panelSize / 2 },
        { text: cardinalDirectionMap.right, x: panelSize - directionSelectorSize / 2, y: panelSize / 2 },
        { text: cardinalDirectionMap.up, x: panelSize / 2, y: directionSelectorSize / 2 },
        { text: cardinalDirectionMap.down, x: panelSize / 2, y: panelSize - directionSelectorSize / 2 },
    ];

    return (
        <Layer listening={false}>
            {textElements.map(({ text, x, y }, index) => (
                <PanelText key={index} text={text} x={x} y={y} isPanelLocked={isPanelLocked} />
            ))}
        </Layer>
    );
};

export default PanelTexts;