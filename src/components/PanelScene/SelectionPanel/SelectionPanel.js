import React from 'react';
import DirectionSelectors from './DirectionSelectors/DirectionSelectors';
import MoveSelectors from './MoveSelectors/MoveSelectors';
import PanelTexts from './PanelTexts/PanelTexts';


const SelectionPanel = ({
    allowedPositions, 
    directionMap, 
    setDirectionMap, 
    isPanelLocked,
    currentHoveredPose,
    setCurrentHoveredPose,
    currentSelectedPose,
    setCurrentSelectedPose,
    panelSize, 
    directionSelectorSize, 
    moveSelectorSize, 
    selectorOffsetSize
}) => {

    return (
        <>  
            <MoveSelectors
                allowedPositions={allowedPositions} 
                directionMap={directionMap}
                setDirectionMap={setDirectionMap}
                isPanelLocked={isPanelLocked} 
                currentHoveredPose={currentHoveredPose}
                setCurrentHoveredPose={setCurrentHoveredPose} 
                currentSelectedPose={currentSelectedPose}
                setCurrentSelectedPose={setCurrentSelectedPose}
                panelSize={panelSize}
                directionSelectorSize={directionSelectorSize}
                moveSelectorSize={moveSelectorSize}
                selectorOffsetSize={selectorOffsetSize}
            />
            <DirectionSelectors 
                allowedPositions={allowedPositions} 
                directionMap={directionMap}
                setDirectionMap={setDirectionMap}
                isPanelLocked={isPanelLocked} 
                currentHoveredPose={currentHoveredPose}
                setCurrentHoveredPose={setCurrentHoveredPose} 
                currentSelectedPose={currentSelectedPose}
                setCurrentSelectedPose={setCurrentSelectedPose}
                panelSize={panelSize}
                directionSelectorSize={directionSelectorSize}
                moveSelectorSize={moveSelectorSize}
                selectorOffsetSize={selectorOffsetSize}
            />
            <PanelTexts
                allowedPositions={allowedPositions} 
                directionMap={directionMap}
                setDirectionMap={setDirectionMap}
                isPanelLocked={isPanelLocked} 
                currentHoveredPose={currentHoveredPose}
                setCurrentHoveredPose={setCurrentHoveredPose} 
                currentSelectedPose={currentSelectedPose}
                setCurrentSelectedPose={setCurrentSelectedPose}
                panelSize={panelSize}
                directionSelectorSize={directionSelectorSize}
                moveSelectorSize={moveSelectorSize}
                selectorOffsetSize={selectorOffsetSize}
            />
        </>
    );
};

export default SelectionPanel;