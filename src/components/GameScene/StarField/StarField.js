import React, {Fragment, createRef} from "react"
import {centerCoord} from "../../../utils/displayHelpers"
import {useFrame} from "react-three-fiber"

const StarField = ({starPositions}) => {

    const meshStarRefs = starPositions.map(() => createRef());
    const meshWireframeRefs = starPositions.map(() => createRef());

    useFrame(() => {
        // Cycle through stars
        for (let i = 0; i < starPositions.length; i++) {
            
            // Generate random number between 0 and 0.02
            const randomSpeed = Math.random() * 0.02;

            if (meshStarRefs[i].current) {
                meshStarRefs[i].current.rotation.y += randomSpeed;
            }
            if (meshWireframeRefs[i].current) {
                meshWireframeRefs[i].current.rotation.y += randomSpeed;
            }
        }
    });

    return (
        <>
            {starPositions.map((position, index) => {
                return (
                    <Fragment key={index}>
                        <mesh 
                            visible
                            position={centerCoord(position)}
                            ref={meshStarRefs[index]}
                        >
                            <octahedronGeometry args={[0.4]}/>
                            <meshBasicMaterial color="black"/>
                        </mesh>
                        <mesh 
                            visible
                            position={centerCoord(position)}
                            ref={meshWireframeRefs[index]}
                        >
                            <octahedronGeometry args={[0.4]}/>
                            <meshBasicMaterial color="blue" wireframe linewidth={6}/>
                        </mesh>
                    </Fragment>
                )
            })}
        </>
    )
}

export default StarField