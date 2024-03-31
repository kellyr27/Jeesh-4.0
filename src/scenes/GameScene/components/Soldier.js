import React from 'react'
import { Cone } from '@react-three/drei'
import { useFrame } from 'react-three-fiber'


// TODO: Merge SoldierController with Soldier

const Soldier = ({ position, rotation, color }) => {

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