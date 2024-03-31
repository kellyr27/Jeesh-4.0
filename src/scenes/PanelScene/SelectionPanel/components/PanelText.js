import React, {useEffect, useRef} from 'react';
import { Stage, Layer, Rect, Line, Text } from 'react-konva';
import {useControls, folder} from 'leva';

const PanelText = ({text, x, y}) => {
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
            fontSize={15} // adjust as needed
            fill='black' // adjust as needed
            align='center'
            verticalAlign='middle'
            ref={textRef}
        />
    );
}

//TODO: When selected bold the text

const PanelTexts = ({panelSize, directionSelectorSize, moveSelectorSize, selectorOffsetSize, directionMap}) => {

    return (

        <Layer listening={false}>
            <PanelText text={directionMap.face} x={panelSize / 2} y={panelSize / 2} />
            <PanelText text={directionMap.left} x={directionSelectorSize / 2} y={panelSize / 2} />
            <PanelText text={directionMap.right} x={panelSize - directionSelectorSize / 2} y={panelSize / 2} />
            <PanelText text={directionMap.up} x={panelSize / 2} y={directionSelectorSize / 2} />
            <PanelText text={directionMap.down} x={panelSize / 2} y={panelSize - directionSelectorSize / 2} />
        </Layer>

    );
};

export default PanelTexts;