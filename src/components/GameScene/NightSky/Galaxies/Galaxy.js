import React, { useRef, useEffect } from "react";
import { useThree, useFrame } from "react-three-fiber";
import { Vector3, Color, BufferAttribute, Matrix4, AdditiveBlending, ArrowHelper } from "three";
import {getTransformerMatrix, getNormalVector} from './Galaxy.utils'

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
	showArrowHelper
}) => {
	const particles = useRef();

	/**
	 * Get the transformer matrix for the galaxy
	 */
	const transformMatrix = useRef(null)
	useEffect(() => {
		transformMatrix.current = getTransformerMatrix(centerPosition)
	}, [centerPosition])

	/**
	 * Get the perpendicular vector of the galaxy
	 */
	const [normalVector, setNormalVector] = React.useState(null)
	const { scene } = useThree()
	useEffect(() => {
		if (transformMatrix.current) {
			setNormalVector(getNormalVector(transformMatrix.current))
		}
	}, [transformMatrix, scene, centerPosition])

	

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
	 * Rotate the galaxy with a random speed between 0.001 and 0.09
	 */
	const rotationSpeed = useRef(0.001 + Math.random() * (0.09 - 0.001))
	useFrame((state, delta) => {
		if (particles.current && normalVector) {
			particles.current.rotateOnAxis(normalVector, delta * rotationSpeed.current);
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
		{showArrowHelper && normalVector && <arrowHelper args={
			[normalVector, 
			new Vector3(centerPosition[0], centerPosition[1], centerPosition[2]), 
			11, 
			0xff0000
		]} />}
	</>
  );
};

export default Galaxy