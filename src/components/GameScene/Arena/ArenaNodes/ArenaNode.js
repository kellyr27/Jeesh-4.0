import { Box } from '@react-three/drei';
import React, { useState, useEffect, memo } from 'react'
import { centerCoord } from '../../../../utils/displayHelpers';

const ArenaNode = memo(({position, color, opacity}) => {

    return (
        <Box 
            args={[1,1,1]}
            position={centerCoord(position)}
            material-color={color}
            material-transparent={true}
            material-opacity={opacity}
        />
    );
})

export default ArenaNode;