import React, { Suspense, useEffect, useState } from 'react';
import { useThree } from 'react-three-fiber';
import { Bloom } from '@react-three/postprocessing';
import { distributeStars, generateStarPoints, loadStarTextures } from './Stars.utils';


const starSizes = [3, 5, 7, 9]

const Stars = ({numStars}) => {
	const { scene } = useThree();
	const [starTextures, setStarTextures] = useState([]);

    /**
     * This useEffect hook is responsible for loading the star textures when the component mounts.
     * It defines an asynchronous function that calls the loadStarTextures function, which returns a promise that resolves with an array of textures.
     * Once the textures are loaded, they are stored in state using the setStarTextures function.
     * The empty dependency array means this useEffect hook will run once when the component mounts, and not on subsequent re-renders.
     */
	useEffect(() => {
        const loadTextures = async () => {
            const textures = await loadStarTextures();
            setStarTextures(textures);
        };
    
        loadTextures();
    }, []);

    /**
     * This useEffect hook is responsible for generating and adding a star field to the scene.
     * It runs whenever the scene, numStars, or starTextures change.
     * If starTextures is not empty and the scene is defined, it distributes the total number of stars among the different combinations of star sizes and textures.
     * For each combination of size and texture, it generates a set of points representing a portion of the star field, and adds these points to the scene.
     */
	useEffect(() => {
		if (starTextures.length > 0 && scene) {
            const numStarsPerMaterial = distributeStars(numStars, starTextures.length * starSizes.length);
            let materialIndex = 0
			for (const size of starSizes) {
				for (const texture of starTextures) {
                    const numStarsForThisMaterial = numStarsPerMaterial[materialIndex];
                    const points = generateStarPoints(numStarsForThisMaterial, texture, size, 175, 200);
                    scene.add(points);
                    materialIndex++;
				}
			}
        }
	}, [scene, numStars, starTextures]);



	return (
		<Suspense fallback={null}>
			<Bloom />
		</Suspense>
	);
};

export default Stars;