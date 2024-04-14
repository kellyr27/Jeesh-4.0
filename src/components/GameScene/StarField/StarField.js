import React, {Fragment} from "react"
import {centerCoord} from "../../../utils/displayHelpers"

const StarField = ({starPositions}) => {


    return (
        <>
            {starPositions.map((position, index) => {
                return (
                    <Fragment key={index}>
                        <mesh 
                            visible
                            position={centerCoord(position)}
                        >
                            <octahedronGeometry args={[0.4]}/>
                            <meshBasicMaterial color="black"/>
                        </mesh>
                        <mesh 
                            visible
                            position={centerCoord(position)}
                        >
                            <octahedronGeometry args={[0.4]}/>
                            <meshBasicMaterial color="blue" wireframe/>
                        </mesh>
                    </Fragment>
                )
            })}
        </>
    )
}

export default StarField