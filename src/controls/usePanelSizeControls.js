import { useControls, folder } from 'leva'

const usePanelSizeControls = () => {
    const { panelSize } = useControls('Selection Panel', {
        'Size Adjustments': folder({
            panelSize: {
                value: 250,
                min: 100,
                max: 500,
                step: 1
            }
        })
    })

    return panelSize;
}

export default usePanelSizeControls