import React, { useState } from "react"
import { Cone } from "@react-three/drei"
import { getRotationFromDirection } from "../../../../utils/directionHelpers"

const Soldier2 = ({
    color,
    soldier
}) => {

    const [position, setPosition] = useState(soldier.gamePosition)
    const [rotation, setRotation] = useState(getRotationFromDirection(soldier.direction))

    return (

        <Cone 
            args={[0.4, 0.8]} 
            position={position} 
            rotation={rotation}
            material-color={color}      
        />
)
}

export default Soldier2