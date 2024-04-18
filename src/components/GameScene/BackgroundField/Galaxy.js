import React, { useRef, useEffect, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "react-three-fiber";
import { useControls } from 'leva';
import { useThree } from 'react-three-fiber';

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

  // Generating a random axis
	const center = new THREE.Vector3(
		centerPosition[0], 
		centerPosition[1], 
		centerPosition[2]
	);

	const randomVector1 = new THREE.Vector3(
		Math.random() - 0.5, // Random x coordinate between -0.5 and 0.5
		Math.random() - 0.5, // Random y coordinate between -0.5 and 0.5
		Math.random() - 0.5  // Random z coordinate between -0.5 and 0.5
	);
	const randomVector2 = new THREE.Vector3(
		Math.random() - 0.5, // Random x coordinate between -0.5 and 0.5
		Math.random() - 0.5, // Random y coordinate between -0.5 and 0.5
		Math.random() - 0.5  // Random z coordinate between -0.5 and 0.5
	);

	const normal = new THREE.Vector3().crossVectors(randomVector1, randomVector2).normalize();

	const transformMatrix = new THREE.Matrix4().lookAt(center, center.clone().add(normal), new THREE.Vector3(0, 1, 0));


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
			
			const point = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
			const transformedPoint = point.clone().applyMatrix4(transformMatrix)

			positions[i3] = transformedPoint.x;
			positions[i3 + 1] = transformedPoint.y;
			positions[i3 + 2] = transformedPoint.z;
		
			const mixedColor = colorInside.clone();
			mixedColor.lerp(colorOutside, radiusValue / radius);
		
			colors[i3] = mixedColor.r;
			colors[i3 + 1] = mixedColor.g;
			colors[i3 + 2] = mixedColor.b;
			}
		
			particles.current.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
			particles.current.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
		};

		particles.current.position.set(centerPosition[0], centerPosition[1], centerPosition[2]);
		generateGalaxy();
	}, [centerPosition, size, count, radius, branches, spin, randomness, randomnessPower, colorIn, colorOut]);


	const { scene } = useThree();
	useFrame(() => {
		const elapsedTime = clock.getElapsedTime();
		// particles.current.rotateOnAxis(rotationAxis);
		// particles.current.rotation.y = elapsedTime * 0.05;

		// particles.current.rotation.set(0, 0, 0);
		// particles.current.rotateOnAxis(normal, elapsedTime * 0.05);
		
		const arrowHelper = new THREE.ArrowHelper(normal, new THREE.Vector3(0, 0, 0), 10, 0xff0000);

		// Add it to the scene
		scene.add(arrowHelper);

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