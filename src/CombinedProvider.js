import React from 'react';
import {SelectionPanelInteractionProvider} from './context/SelectionPanelInteractionContext';
import {CameraInteractionProvider} from './context/CameraInteractionContext';

const CombinedProvider = ({ children }) => {
    return (
        <CameraInteractionProvider>
            <SelectionPanelInteractionProvider>
                {children}
            </SelectionPanelInteractionProvider>
        </CameraInteractionProvider>
    );
};

export default CombinedProvider;