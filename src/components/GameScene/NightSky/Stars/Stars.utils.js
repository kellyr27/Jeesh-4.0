import {BufferGeometry, BufferAttribute, PointsMaterial, Points, Color, AdditiveBlending, TextureLoader} from 'three';
/**
 * This function generates a random point within a spherical volume.
 * It takes as input an inner radius and an outer radius, and generates a point that is within this spherical shell.
 * The position of the point is determined using spherical coordinates (theta, phi, radius), where theta and phi are random angles, and radius is a random value between the inner and outer radius.
 * These spherical coordinates are then converted to Cartesian coordinates (x, y, z) using the standard conversion formulas.
 *
 * @param {number} innerRadius - The inner radius of the spherical volume.
 * @param {number} outerRadius - The outer radius of the spherical volume.
 * @returns {Array<number>} - The Cartesian coordinates of the generated point.
 */
const getPointPosition = (innerRadius, outerRadius) => {

	const theta = Math.random() * Math.PI * 2;
	const phi = Math.random() * Math.PI;
	const radius = Math.random() * (outerRadius - innerRadius) + innerRadius;
	const x = Math.sin(phi) * Math.cos(theta) * radius;
	const y = Math.cos(phi) * radius;
	const z = Math.sin(phi) * Math.sin(theta) * radius;

	return [x, y, z];
}

/**
 * This function distributes a number of stars among a number of materials.
 * It takes as input the number of stars and the number of materials, and returns an array where each element represents the number of stars assigned to each material.
 * The distribution is done randomly, with each star being assigned to a random material.
 *
 * @param {number} numStars - The number of stars to distribute.
 * @param {number} numMaterials - The number of materials to distribute the stars among.
 * @returns {Array<number>} - An array where each element represents the number of stars assigned to each material.
 */
const distributeStars = (numStars, numMaterials) => {
	let materials = new Array(numMaterials).fill(0);
  
	for (let i = 0; i < numStars; i++) {
	  let randomMaterial = Math.floor(Math.random() * numMaterials);
	  materials[randomMaterial]++;
	}

	return materials;
}

/**
 * This function generates a star field using Three.js Points.
 * It takes as input the number of stars, the texture for the stars, the size of the stars, and the scene to which the stars will be added.
 * The function first creates a BufferGeometry, and then generates random positions and colors for each star.
 * The positions and colors are stored in Float32Arrays and added to the BufferGeometry as attributes.
 * A PointsMaterial is then created using the provided star texture and size, and with vertexColors set to true to use the generated colors.
 * The function finally creates a Points object using the BufferGeometry and PointsMaterial, and returns this object.
 *
 * @param {number} numStars - The number of stars to generate.
 * @param {THREE.Texture} starTexture - The texture to use for the stars.
 * @param {number} starSize - The size of the stars.
 * @param {THREE.Scene} scene - The scene to which the stars will be added.
 * @returns {THREE.Points} - A Points object representing the star field.
 */
const generateStarPoints = (numStars, starTexture, starSize, innerRadius, outerRadius) => {
	const geometry = new BufferGeometry();
	const positions = new Float32Array(numStars * 3); 
	const colors = new Float32Array(numStars * 3); 

	for (let i = 0; i < numStars; i++) {
		const [x, y, z] = getPointPosition(innerRadius, outerRadius);
		positions[i * 3] = x;
		positions[i * 3 + 1] = y;
		positions[i * 3 + 2] = z;

		const color = new Color().setHSL(Math.random(), 1, 0.5);
		colors[i * 3] = color.r;
		colors[i * 3 + 1] = color.g;
		colors[i * 3 + 2] = color.b;
	}

	geometry.setAttribute('position', new BufferAttribute(positions, 3));
	geometry.setAttribute('color', new BufferAttribute(colors, 3));

	const material = new PointsMaterial({ 
		size: starSize, 
		vertexColors: true, 
		map: starTexture,
		transparent: true,
		blending: AdditiveBlending,
		depthWrite: false,
	})

	return new Points(geometry, material);
}

/**
 * This function asynchronously loads a series of star textures.
 * It uses the Three.js TextureLoader to load each texture, and stores the loaded textures in an array.
 * The textures are located in the /starTextures directory, and are named star_01.png, star_02.png, ..., star_09.png.
 * The function returns a promise that resolves with the array of loaded textures.
 *
 * @returns {Promise<Array<THREE.Texture>>} - A promise that resolves with an array of loaded textures.
 */
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

    return textures
};

export {
    distributeStars,
    generateStarPoints,
    loadStarTextures
}