import {Line} from '@react-three/drei';
import React from 'react';
import { Vector3 } from 'three';
import { ARENA_LENGTH } from '../../../../../globals';

// Vector3Points is an array of Vector3 objects

const PastLine = ({
    vector3Points,
    color,
    linewidth,
    opacity, 
    isDisplay
}) => {


    const offsetVector3Points = vector3Points.map(point => 
        new Vector3(
            point.x + 0.5 - ARENA_LENGTH / 2,
            point.y + 0.5 - ARENA_LENGTH / 2,
            point.z + 0.5 - ARENA_LENGTH / 2
        )
    );

    return (
        <Line
            points={offsetVector3Points}
            color={'yellow'}
            linewidth={10}
            opacity={1}
        />
    );
}

export default PastLine;