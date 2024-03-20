import React from 'react';
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { TrackballControls } from "@react-three/drei";

const GameScene = () => {
    return (
        <Canvas style={{ width: '100vw', height: '100vh' }}>
            <color attach="background" args={["#191920"]} />
            <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={1}
            />
            <TrackballControls makeDefault rotateSpeed="3" />
        </Canvas>
    )
}

export default GameScene;