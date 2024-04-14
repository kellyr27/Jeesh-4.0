import { useControls, folder } from "leva";

const useMoveSelectorsControls = () => {
    
    const { moveSelectorDefaultColor, moveSelectorHoveredColor, moveSelectorSelectedColor, moveSelectorBlockedColor } = useControls('Selection Panel', {
        'Colors': folder({
            moveSelectorDefaultColor: '#00D2FF',
            moveSelectorHoveredColor: '#FF00D2',
            moveSelectorSelectedColor: '#D200FF',
            moveSelectorBlockedColor: '#FFD200'
        })
    })
    
    return {
        moveSelectorDefaultColor,
        moveSelectorHoveredColor,
        moveSelectorSelectedColor,
        moveSelectorBlockedColor
    }
}

export default useMoveSelectorsControls;