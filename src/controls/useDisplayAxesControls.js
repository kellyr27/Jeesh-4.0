import { useControls } from 'leva'

const useDisplayAxesControls = () => {
    const { 'AxesHelper': showAxesHelper } = useControls('Game Scene', {
        'AxesHelper': true,
    })

    return showAxesHelper;
}

export default useDisplayAxesControls
