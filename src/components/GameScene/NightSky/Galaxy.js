import React, { useRef, useEffect, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "react-three-fiber";
import { useControls } from 'leva';
import { useThree } from 'react-three-fiber';
import { Vector3, Color, BufferAttribute, Matrix4, AdditiveBlending, ArrowHelper } from "three";
import Galaxy from "./Galaxies/Galaxy";

function generateRandomPointInSphere(minRadius, maxRadius) {
    // Generate a random radius between minRadius and maxRadius
    const radius = Math.random() * (maxRadius - minRadius) + minRadius;

    // Generate a random azimuthal angle between 0 and 2π
    const theta = Math.random() * 2 * Math.PI;

    // Generate a random polar angle between 0 and π
    const phi = Math.random() * Math.PI;

    // Convert spherical coordinates to Cartesian coordinates
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    return [x, y, z];
}

function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgb(${r}, ${g}, ${b})`;
}

function generateRandomRadius(min, max) {
	// Generate random radius between min and max
	return Math.random() * (max - min) + min
}

function generateRandomBranches(min, max) {
	// Generate random branches between min and max
	return Math.floor(Math.random() * (max - min) + min)
}


export default function GalaxyApp() {
	
	const [randomCenters, setRandomCenters] = React.useState([])

	useEffect(() => {

		// Generate a random number of galaxies between 30 and 60
		// const randomGalaxyCount = Math.floor(Math.random() * 30) + 30
		const randomGalaxyCount = 100
		// Galaxy centres coordinates need to be between -100 and -80 and 80 and 100
		const randomCenters = Array.from({length: randomGalaxyCount}, () => generateRandomPointInSphere(175, 200))
		console.log(randomCenters)

		setRandomCenters(randomCenters)
	}, [])
	
	return (
		<>
			<Suspense fallback={null}>
				{randomCenters.map((center) => <Galaxy 
					centerPosition={center}
					size={0.01}
					count={6000}
					radius={generateRandomRadius(3, 7)}
					branches={generateRandomBranches(2,5)}
					spin={1 }
					randomness={0.7 }
					randomnessPower={ 9 }
					colorIn={generateRandomColor()}
					colorOut={generateRandomColor()}
					showArrowHelper={true}
				/>)}
			</Suspense>
		</>
	);
}