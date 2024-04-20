import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// import star1TextureUrl from `${process.env.PUBLIC_URL}/starTextures/star1.png`;
import {useLoader} from 'react-three-fiber';

const star1TextureUrl = `${process.env.PUBLIC_URL}/starTextures/star1.png`;
console.log(star1TextureUrl);

const Star = ({ position, color }) => {
    const meshRef = useRef();
    const starTexture = useLoader(THREE.TextureLoader, star1TextureUrl);

    useEffect(() => {
        const mesh = meshRef.current;

        const starSize = Math.random() * 2 + 0.5; // Random size between 0.5 and 2
        const starColor = new THREE.Color().setHSL(color[0], color[1], color[2]); // Set color from props

        mesh.position.set(position[0], position[1], position[2]);
        mesh.material.color = starColor;
        mesh.scale.set(starSize, starSize, starSize);
    }, [position, color]);

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial map={starTexture}/>
        </mesh>
    );
};

export default Star;
