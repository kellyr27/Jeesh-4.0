import React, {createContext, useState, useContext} from 'react'

const SelectionPanelInteractionContext = createContext()

const SelectionPanelInteractionProvider = ({children}) => {
    const [allowedRelativeMovePositions, setAllowedRelativeMovePositions] = useState(null)
    const [initialCardinalDirectionMap, setInitialCardinalDirectionMap] = useState({
        face: '+z',
        left: '-x',
        right: '+x',
        up: '+y',
        down: '-y'
    })
    const [relativeHoveredPosition, setRelativeHoveredPosition] = useState(null)
    const [selectedSoldierId, setSelectedSoldierId] = useState(null)
    const [selectedSoldierPose, setSelectedSoldierPose] = useState(null)
    const [selectedRelativePose, setSelectedRelativePose] = useState(null)

    const [lockSelectionPanel, setLockSelectionPanel] = useState(false)

    return (
        <SelectionPanelInteractionContext.Provider value={{
            allowedRelativeMovePositions,
            setAllowedRelativeMovePositions,
            initialCardinalDirectionMap,
            setInitialCardinalDirectionMap,
            relativeHoveredPosition,
            setRelativeHoveredPosition,
            selectedSoldierId,
            setSelectedSoldierId,
            selectedSoldierPose,
            setSelectedSoldierPose,
            selectedRelativePose,
            setSelectedRelativePose,
            lockSelectionPanel,
            setLockSelectionPanel
        }}>
            {children}
        </SelectionPanelInteractionContext.Provider>
    )
}

const useSelectionPanelInteractionContext = () => {
    return useContext(SelectionPanelInteractionContext)
}

export {
    SelectionPanelInteractionProvider,
    useSelectionPanelInteractionContext
}
