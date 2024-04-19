import React from 'react';
import {SelectionPanelInteractionProvider} from './context/SelectionPanelInteractionContext';
import {CameraInteractionProvider} from './context/CameraInteractionContext';

/**
 * This is a higher-order component that wraps its children with both CameraInteractionProvider and SelectionPanelInteractionProvider.
 * These providers are used to manage the state and interactions related to the camera and the selection panel, respectively.
 * By using this CombinedProvider, the wrapped components can access the context provided by both providers.
 *
 * @param {Object} props - The properties passed to this component, including 'children' which represents the components to be wrapped.
 * @returns {JSX.Element} - A JSX element where the children are wrapped with the CameraInteractionProvider and SelectionPanelInteractionProvider.
 */
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