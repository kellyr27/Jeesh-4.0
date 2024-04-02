import { Box } from '@react-three/drei';
import React, { useState, useEffect } from 'react'
import { centerCoord } from '../../../../utils/displayHelpers';

const ArenaNode = ({position, color, opacity}) => {

    return (
        <Box 
            args={[1,1,1]}
            // position={centerCoord(position)}
            position={position}
            material-color={color}
            material-transparent={true}
            material-opacity={opacity}
        />
        
    )
}

export default ArenaNode;