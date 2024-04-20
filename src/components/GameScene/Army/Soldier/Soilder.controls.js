import { useControls, folder } from 'leva'

const usePhaseTimeControls = () => {
    const { phase1Time, phase2Time, phase3Time } = useControls('Soldiers', {
        'Movement Times': folder({
            phase1Time: { value: 2, min: 0, max: 10, step: 0.1 },
            phase2Time: { value: 3, min: 0, max: 10, step: 0.1 },
            phase3Time: { value: 2, min: 0, max: 10, step: 0.1 },
        })
    })

    return { phase1Time, phase2Time, phase3Time }
}

export {usePhaseTimeControls}