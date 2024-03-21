import React from 'react'
import { Cone } from '@react-three/drei'
import { useFrame } from 'react-three-fiber'

const Soldier = ({ position, rotation, color }) => {
    
    // Print out the position and rotation of the soldier every frame
    useFrame(() => {
        console.log('Soldiers position is ', position)
    })


    return (
        <Cone 
            args={[0.4, 0.8]} 
            position={position} 
            rotation={rotation}
            material-color={color}            
        />
    )
}

export default Soldier