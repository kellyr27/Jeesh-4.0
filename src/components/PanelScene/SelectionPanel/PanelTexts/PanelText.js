import React, {useEffect, useRef} from 'react';
import { Text } from 'react-konva';

const PanelText = ({text, x, y, isPanelLocked}) => {
    const textRef = useRef();

    /**
     * This useEffect hook is used to adjust the position of the text element whenever its `x` or `y` props change.
     * It updates the `x` and `y` attributes of the text element to center it based on its calculated width and height.
     */
    useEffect(() => {
        if (textRef.current) {
            const textWidth = textRef.current.width();
            const textHeight = textRef.current.height();

            textRef.current.setAttrs({
                x: x - textWidth / 2,
                y: y - textHeight / 2
            })
        }
    }, [x, y])

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
    )
}

export default PanelText;