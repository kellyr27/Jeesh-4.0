import React, {Fragment} from "react"

const StarField = ({starPositions}) => {

    return (
        <>
            {starPositions.map((coord, index) => {
                return (
                    <Fragment key={index}>
                        <mesh 
                            visible
                            position={coord}
                        >
                            <octahedronGeometry args={[0.4]}/>
                            <meshBasicMaterial color="black"/>
                        </mesh>
                        <mesh 
                            visible
                            position={coord}
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