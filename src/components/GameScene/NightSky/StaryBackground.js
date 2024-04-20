import React, { useRef,useState, useEffect, Suspense } from 'react';
import { useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { Bloom } from '@react-three/postprocessing';
import {TextureLoader} from 'three';

const starSizes = [3, 5, 7, 9]

const getPointPosition = () => {

	const innerRadius = 175;
	const outerRadius = 200;

	const theta = Math.random() * Math.PI * 2;
	const phi = Math.random() * Math.PI;
	const radius = Math.random() * (outerRadius - innerRadius) + innerRadius;
	const x = Math.sin(phi) * Math.cos(theta) * radius;
	const y = Math.cos(phi) * radius;
	const z = Math.sin(phi) * Math.sin(theta) * radius;

	return [x, y, z];
}

const distributeStars = (numStars, numMaterials) => {
	let materials = new Array(numMaterials).fill(0);
  
	for (let i = 0; i < numStars; i++) {
	  let randomMaterial = Math.floor(Math.random() * numMaterials);
	  materials[randomMaterial]++;
	}

	return materials;
}

const generateStarPoints = (numStars, starTexture, starSize, scene) => {
	const geometry = new THREE.BufferGeometry();
	const positions = new Float32Array(numStars * 3); 
	const colors = new Float32Array(numStars * 3); 

	for (let i = 0; i < numStars; i++) {


		const [x, y, z] = getPointPosition();
		positions[i * 3] = x;
		positions[i * 3 + 1] = y;
		positions[i * 3 + 2] = z;

		const color = new THREE.Color().setHSL(Math.random(), 1, 0.5);
		colors[i * 3] = color.r;
		colors[i * 3 + 1] = color.g;
		colors[i * 3 + 2] = color.b;

	}

	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

	const material = new THREE.PointsMaterial({ 
		size: starSize, 
		vertexColors: true, 
		map: starTexture,
		transparent: true,
		blending: THREE.AdditiveBlending,
		depthWrite: false,
	})

	const points = new THREE.Points(geometry, material);
	scene.add(points)
}

const StaryBackground = ({numStars}) => {
	const { scene } = useThree();
	// const starsRef = useRef();

	const [starTextures, setStarTextures] = useState([]);
	const [batchNumber, setBatchNumber] = useState(null);

	useEffect(() => {
		const loadStarTextures = async () => {
			const textures = [];
			const loader = new TextureLoader();

			for (let i = 1; i <= 9; i++) {
				const textureUrl = `${process.env.PUBLIC_URL}/starTextures/star_0${i}.png`;
				const texture = await new Promise((resolve, reject) => {
				loader.load(textureUrl, resolve, undefined, reject);
				});
				textures.push(texture);
			}

			setStarTextures(textures);
			setBatchNumber(1);
		};

		loadStarTextures();
	}, []);

	useEffect(() => {
		
		if (starTextures.length === 0 || !scene) {
			return
		}
		if (batchNumber === 1) {
			
			for (const size of starSizes) {
				for (const texture of starTextures) {
					generateStarPoints(numStars, texture, size, scene);
				}
			}

			setBatchNumber(2);
		}
	}, [scene, numStars, starTextures, batchNumber]);



	return (
		<Suspense fallback={null}>
			<Bloom />
		</Suspense>
	);
};

export default StaryBackground;