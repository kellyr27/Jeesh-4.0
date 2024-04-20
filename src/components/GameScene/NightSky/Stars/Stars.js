import React, { Suspense, useEffect, useState } from 'react';
import { useThree } from 'react-three-fiber';
import { Bloom } from '@react-three/postprocessing';
import { generateStars, loadStarTextures } from './Stars.utils';


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
     * This useEffect hook is responsible for generating a star field and updating the scene with the new stars.
     * It runs whenever the `scene`, `numStars`, `starTextures`, `generatePoints`, or `starPoints` change.
     * If `starTextures` is not empty, the `scene` is defined, and `generatePoints` is `true`, it:
     * 1. Removes the old points from the scene
     * 2. Generates new points for each combination of star size and texture
     * 3. Adds these new points to the scene
     * 4. Updates the state with the new points
     * After generating the points, it sets `generatePoints` to `false` to prevent unnecessary re-generation of points.
     */
    const [starPoints, setStarPoints] = useState([]);
    const [generatePoints, setGeneratePoints] = useState(true);
	useEffect(() => {
        const updateScene = (scene, oldPoints, newPoints) => {
            for (const point of oldPoints) {
                scene.remove(point);
            }
            for (const point of newPoints) {
                scene.add(point);
            }
            return scene;
        }

		if (starTextures.length > 0 && scene && generatePoints) {
            const newPoints = generateStars(numStars, starSizes, starTextures);
            updateScene(scene, starPoints, newPoints);
            setStarPoints(newPoints);
            setGeneratePoints(false);
        }
	}, [scene, numStars, starTextures, generatePoints, starPoints]);

    /**
     * This useEffect hook is responsible for updating the star field when the number of stars changes.
     * It runs whenever the numStars prop changes, and sets the generatePoints state variable to true.
     * This triggers the generation of a new star field in the previous useEffect hook.
     */
    useEffect(() => {
        setGeneratePoints(true);
    }, [numStars]);



	return (
		<Suspense fallback={null}>
			<Bloom />
		</Suspense>
	);
};

export default Stars;