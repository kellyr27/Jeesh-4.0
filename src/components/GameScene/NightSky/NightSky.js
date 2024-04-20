import React from 'react';
import Galaxies from './Galaxies/Galaxies';
import Stars from './Stars/Stars';

const NightSky = () => {
    return (
        <>
            <Galaxies galaxyCount={100} />
            <Stars numStars={10000} />
        </>
    )
}

export default NightSky;