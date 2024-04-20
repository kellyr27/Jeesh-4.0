import React from 'react';
import Galaxies from './Galaxies/Galaxies';
import Stars from './Stars/Stars';
import useNightSkyControls from './Nightsky.controls';

const NightSky = () => {

    const { numStars, numGalaxies, showGalaxyNormals } = useNightSkyControls()

    return (
        <>
            <Galaxies galaxyCount={numGalaxies} showArrowHelper={showGalaxyNormals} />
            <Stars numStars={numStars} />
        </>
    )
}

export default NightSky;