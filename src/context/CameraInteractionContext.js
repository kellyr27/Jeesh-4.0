import React, {createContext, useState, useContext} from 'react'

const CameraInteractionContext = createContext()

const CameraInteractionProvider = ({children}) => {
   

   const [selectedSoldierObject, setSelectedSoldierObject] = useState(null)
   

    return (
        <CameraInteractionContext.Provider value={{
            selectedSoldierObject,
            setSelectedSoldierObject
        }}>
            {children}
        </CameraInteractionContext.Provider>
    )
}

const useCameraInteractionContext = () => {
    return useContext(CameraInteractionContext)
}

export {
    CameraInteractionProvider,
    useCameraInteractionContext
}
