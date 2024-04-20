import { useControls, folder } from 'leva';

const useNightSkyControls = () => {
    const {
        'Num Stars': numStars,
        'Num Galaxies': numGalaxies,
        'Show Galaxy Normals': showGalaxyNormals,
    } = useControls('Game Scene', {
        'Nightsky': folder({
            'Num Stars': {
                value: 10000,
                min: 1,
                max: 100000,
                step: 100
            },
            'Num Galaxies': {
                value: 100,
                min: 0,
                max: 1000,
                step: 5
            },
            'Show Galaxy Normals': false,
        })
    })

    return {
        numStars,
        numGalaxies,
        showGalaxyNormals
    }
}

export default useNightSkyControls;