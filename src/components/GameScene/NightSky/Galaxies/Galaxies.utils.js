const generateRandomPointInSphere = (minRadius, maxRadius) => {
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

const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgb(${r}, ${g}, ${b})`;
}

const generateRandomRadius = (min, max) => {
	// Generate random radius between min and max
	return Math.random() * (max - min) + min
}

const generateRandomBranches = (min, max) => {
	// Generate random branches between min and max
	return Math.floor(Math.random() * (max - min) + min)
}

export {
    generateRandomPointInSphere, 
    generateRandomColor, 
    generateRandomRadius, 
    generateRandomBranches}