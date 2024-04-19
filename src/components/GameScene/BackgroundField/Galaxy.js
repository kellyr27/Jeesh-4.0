import React, { useRef, useEffect, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "react-three-fiber";
import { useControls } from 'leva';
import { useThree } from 'react-three-fiber';
import { Vector3, Color, BufferAttribute, Matrix4, AdditiveBlending, ArrowHelper } from "three";


//TODO Adjust the number of galaxies with Leva
const Galaxy = ({
	centerPosition,
	size,
	count,
	radius,
	branches,
	spin,
	randomness,
	randomnessPower,
	colorIn,
	colorOut,
}) => {
	const particles = useRef();

	/**
	 * Get the transformer matrix for the galaxy
	 */
	const transformMatrix = useRef(null)
	useEffect(() => {
		const center = new Vector3(
			centerPosition[0], 
			centerPosition[1], 
			centerPosition[2]
		)
		const randomVector1 = new Vector3(
			Math.random() - 0.5,
			Math.random() - 0.5, 
			Math.random() - 0.5 
		)
		const randomVector2 = new Vector3(
			Math.random() - 0.5,
			Math.random() - 0.5, 
			Math.random() - 0.5  
		)
		const normal = new Vector3().crossVectors(randomVector1, randomVector2).normalize()
		transformMatrix.current = new Matrix4().lookAt(center, center.clone().add(normal), new Vector3(0, 1, 0))
	}, [centerPosition])

	/**
	 * Get the perpendicular vector of the galaxy
	 */
	const perpendicularVector = useRef(null)
	const { scene } = useThree()
	useEffect(() => {
		if (transformMatrix.current) {
			const p1 = new Vector3(10, 0, 27)
			const p2 = new Vector3(9, 0 , 5)
			const p3 = new Vector3(2, 0, 2)
			
			const v1 = new Vector3().subVectors(p2, p1)
			const v2 = new Vector3().subVectors(p3, p1)

			const temp = new Vector3().crossVectors(v1, v2).normalize()
			perpendicularVector.current = temp.clone().applyMatrix4(transformMatrix.current)

			// Create an arrow helper to visualize the normal
			const arrowHelper = new ArrowHelper(perpendicularVector.current, new Vector3(centerPosition[0], 
				centerPosition[1], 
				centerPosition[2]), 11, 0xff0000);

			// Add the arrow helper to the scene
			scene.add(arrowHelper);
		}
	}, [transformMatrix, scene])

	

  	useEffect(() => {
		const generateGalaxy = () => {
			const positions = new Float32Array(count * 3);
			const colors = new Float32Array(count * 3);
			const colorInside = new Color(colorIn);
			const colorOutside = new Color(colorOut);
		
			for (let i = 0; i < count; i++) {
				const i3 = i * 3;
			
				const radiusValue = Math.random() * radius;
				const spinAngle = radiusValue * spin;
				const branchAngle = ((i % branches) / branches) * Math.PI * 2;
			
				const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radiusValue;
				const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radiusValue;
				const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radiusValue;
			
				positions[i3] = Math.cos(branchAngle + spinAngle) * radiusValue + randomX;
				positions[i3 + 1] = randomY;
				positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radiusValue + randomZ;
				
				const point = new Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
				const transformedPoint = point.clone().applyMatrix4(transformMatrix.current)

				positions[i3] = transformedPoint.x;
				positions[i3 + 1] = transformedPoint.y;
				positions[i3 + 2] = transformedPoint.z;
			
				const mixedColor = colorInside.clone();
				mixedColor.lerp(colorOutside, radiusValue / radius);
			
				colors[i3] = mixedColor.r;
				colors[i3 + 1] = mixedColor.g;
				colors[i3 + 2] = mixedColor.b;
			}

			particles.current.geometry.setAttribute("position", new BufferAttribute(positions, 3));
			particles.current.geometry.setAttribute("color", new BufferAttribute(colors, 3));
		};
		/// Offset the particles to the center
		particles.current.position.set(centerPosition[0], centerPosition[1], centerPosition[2]);
		generateGalaxy();

	}, [centerPosition, size, count, radius, branches, spin, randomness, randomnessPower, colorIn, colorOut]);

	/**
	 * Rotate the galaxy
	 */
	const rotationSpeed = useRef(0.001 + Math.random() * (0.07 - 0.001))
	useFrame((state, delta) => {
		if (particles.current && perpendicularVector.current) {
			particles.current.rotateOnAxis(perpendicularVector.current, delta * rotationSpeed.current);
		}
	});

  return (
	<>
		<points ref={particles}>
			<bufferGeometry />
			<pointsMaterial
				size={size}
				sizeAttenuation={true}
				depthWrite={false}
				vertexColors={true}
				blending={AdditiveBlending}
			/>
		</points>
	</>
  );
};

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
					radius={generateRandomRadius(1, 3)}
					branches={generateRandomBranches(2,5)}
					spin={1 }
					randomness={0.7 }
					randomnessPower={ 9 }
					colorIn={generateRandomColor()}
					colorOut={generateRandomColor()}
				/>)}
			</Suspense>
		</>
	);
}