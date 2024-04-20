import React, {useEffect, useState, Suspense} from "react"
import {generateRandomPointInSphere, generateRandomColor, generateRandomRadius, generateRandomBranches} from './Galaxies.utils'
import Galaxy from "./Galaxy/Galaxy"

const Galaxies = ({galaxyCount}) => {
	
	const [randomCenters, setRandomCenters] = useState([])

	useEffect(() => {
		const randomCenters = Array.from({length: galaxyCount}, () => generateRandomPointInSphere(175, 200))
		setRandomCenters(randomCenters)
	}, [galaxyCount])
	
	return (
        <Suspense fallback={null}>
            {randomCenters.map((center, index) => <Galaxy
                key={index}
                centerPosition={center}
                size={0.01}
                count={6000}
                radius={generateRandomRadius(3, 7)}
                branches={generateRandomBranches(2,5)}
                spin={1 }
                randomness={0.7 }
                randomnessPower={ 9 }
                colorIn={generateRandomColor()}
                colorOut={generateRandomColor()}
                showArrowHelper={false}
            />)}
        </Suspense>
	);
}

export default Galaxies;