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

    const handleDirectionSelectorsClick = (direction) => {
        console.log(`Direction ${direction} was clicked`);
    }

    const handleMoveSelectorsClick = (x) => {
        console.log(`Move ${x} was clicked`);
    }

    const handleMoveSelectorsMouseEnter = (x) => {
        console.log(`Move ${x} was clicked`);
    }

    const handleMoveSelectorsMouseLeave = (x) => {
        console.log(`Move ${x} was clicked`);
    }

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
                onMoveSelectorsClick={handleMoveSelectorsClick}
                onMoveSelectorsMouseEnter={handleMoveSelectorsMouseEnter}
                onMoveSelectorsMouseLeave={handleMoveSelectorsMouseLeave}
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
                onDirectionClick={handleDirectionSelectorsClick}
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