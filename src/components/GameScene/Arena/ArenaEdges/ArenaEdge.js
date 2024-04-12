import {Line} from '@react-three/drei';
import { useEffect, useState, memo } from "react";
import {centerCoords} from '../../../../utils/displayHelpers';

// TODO: Fix lineWidth casing
const ArenaEdge = memo(({
    points,
    color,
    linewidth,
    opacity, 
    isDisplay
}) => {


    return (
        isDisplay && (
            <Line
                points={centerCoords(points)}
                color={color}
                linewidth={linewidth}
                opacity={opacity}
            />
        )
    );
})

export default ArenaEdge;