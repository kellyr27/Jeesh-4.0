import React, { useRef, useEffect, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "react-three-fiber";
import { useControls } from 'leva';
import { useThree } from 'react-three-fiber';
import { Vector3 } from "three";
import { ArrowHelper } from 'three';

const Galaxy = ({centerPosition}) => {
	const particles = useRef();
	const clock = new THREE.Clock();

	const { size, count, radius, branches, spin, randomness, randomnessPower, colorIn, colorOut } = useControls('Galaxy', {
		size: { value: 0.01, min: 0.01, max: 0.1, step: 0.01 },
		count: { value: 12000, min: 1000, max: 20000, step: 1000 },
		radius: { value: 21, min: 1, max: 50, step: 1 },
		branches: { value: 2, min: 1, max: 20, step: 1 },
		spin: { value: 1, min: 1, max: 10, step: 1 },
		randomness: { value: 0.7, min: 0, max: 1, step: 0.1 },
		randomnessPower: { value: 9, min: 1, max: 10, step: 1 },
		colorIn: '#ff6030',
		colorOut: '#1b3984'
	});

	const transformMatrix = useRef(null)
	const tempNormal = useRef(null)
	const newNormal = useRef(null)

	// Add the ArrowHelper to your scene
	const { scene } = useThree();

	useEffect(() => {

		const center = new Vector3(
			centerPosition[0], 
			centerPosition[1], 
			centerPosition[2]
		);
	
		const randomVector1 = new Vector3(
			Math.random() - 0.5,
			Math.random() - 0.5, 
			Math.random() - 0.5 
		);
		const randomVector2 = new Vector3(
			Math.random() - 0.5,
			Math.random() - 0.5, 
			Math.random() - 0.5  
		)

		const normal = new Vector3().crossVectors(randomVector1, randomVector2).normalize();

		tempNormal.current = normal;
		transformMatrix.current = new THREE.Matrix4().lookAt(center, center.clone().add(normal), new Vector3(0, 1, 0));
	}, [centerPosition])

  	useEffect(() => {
		const generateGalaxy = () => {
			const positions = new Float32Array(count * 3);
			const colors = new Float32Array(count * 3);
			const colorInside = new THREE.Color(colorIn);
			const colorOutside = new THREE.Color(colorOut);
		
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

			// Find the perpendicular to the coplanar
			const p1 = new Vector3(10, 0, 27)
			const p2 = new Vector3(9, 0 , 5)
			const p3 = new Vector3(2, 0, 2)
			
			const v1 = new Vector3().subVectors(p2, p1)
			const v2 = new Vector3().subVectors(p3, p1)

			const temp = new Vector3().crossVectors(v1, v2).normalize()
			newNormal.current = temp.clone().applyMatrix4(transformMatrix.current)

			particles.current.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
			particles.current.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
		};

		particles.current.position.set(centerPosition[0], centerPosition[1], centerPosition[2]);
		generateGalaxy();
		
		
		// console.log(tempNormal.current)
		const arrowHelper = new ArrowHelper(newNormal.current, new Vector3(0,0,0), 11, 0xff0000);
		// Add the arrow helper to the scene
		scene.add(arrowHelper);

	}, [centerPosition, size, count, radius, branches, spin, randomness, randomnessPower, colorIn, colorOut]);

	let previousTime = 0;

	useFrame(({ clock }) => {
		const elapsedTime = clock.getElapsedTime();
		// Adjust the rotation speed as needed
		const rotationSpeed = 0.06;
		// particles.current.rotation.y = elapsedTime * rotationSpeed;

		// print the current positions of the particles
		console.log(particles.current)
		
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
				blending={THREE.AdditiveBlending}
			/>
		</points>
	</>
  );
};

export default function GalaxyApp() {
  return (
    <>
        <Suspense fallback={null}>
          <Galaxy centerPosition={[0,0,0]}/>
        </Suspense>
    </>
  );
}