import React, {useEffect, useState, Suspense, } from "react"
import {generateRandomPointInSphere, generateRandomColor, generateRandomRadius, generateRandomBranches} from './Galaxies.utils'
import Galaxy from "./Galaxy/Galaxy"

const Galaxies = ({galaxyCount, showArrowHelper}) => {
	
	const [randomCenters, setRandomCenters] = useState([])
    const [galaxyProperties, setGalaxyProperties] = useState([]);

	useEffect(() => {
		const randomCenters = Array.from({length: galaxyCount}, () => generateRandomPointInSphere(175, 200))
		setRandomCenters(randomCenters)

        // Generate initial values for radius, branches, colorIn, and colorOut
        const initialRadius = generateRandomRadius(3, 7);
        const initialBranches = generateRandomBranches(2, 5);
        const initialColorIn = generateRandomColor();
        const initialColorOut = generateRandomColor();

        // Generate initial properties for galaxies
        const initialGalaxyProperties = randomCenters.map(() => ({
            radius: generateRandomRadius(3, 7),
            branches: generateRandomBranches(2, 5),
            colorIn: generateRandomColor(),
            colorOut: generateRandomColor(),
        }));
        setGalaxyProperties(initialGalaxyProperties);

	}, [galaxyCount])
	
	return (
        <Suspense fallback={null}>
            {randomCenters.map((center, index) => <Galaxy
                key={index}
                centerPosition={center}
                size={0.01}
                count={6000}
                radius={galaxyProperties[index].radius}
                branches={galaxyProperties[index].branches}
                spin={1 }
                randomness={0.7 }
                randomnessPower={ 9 }
                colorIn={galaxyProperties[index].colorIn}
                colorOut={galaxyProperties[index].colorOut}
                showArrowHelper={showArrowHelper}
            />)}
        </Suspense>
	);
}

export default Galaxies;