import React, { useRef, useEffect, useState } from "react";
import {  useFrame } from "react-three-fiber";
import { Vector3, AdditiveBlending } from "three";
import {getTransformerMatrix, getNormalVector, generateGalaxy} from './Galaxy.utils'

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
	const transformMatrix = useRef(null)
	const [normalVector, setNormalVector] = useState(null)

	/**
	 * Get the transformer matrix and the normal vector of the galaxy
	 */
	useEffect(() => {
		transformMatrix.current = getTransformerMatrix(centerPosition)
		setNormalVector(getNormalVector(transformMatrix.current))
	}, [centerPosition])

  	useEffect(() => {
		const [positions, colors] = generateGalaxy(count, colorIn, colorOut, radius, spin, branches, randomnessPower, randomness, transformMatrix.current)
		particles.current.position.set(centerPosition[0], centerPosition[1], centerPosition[2]);
		particles.current.geometry.setAttribute("position", positions);
		particles.current.geometry.setAttribute("color", colors);

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
}

export default Galaxy