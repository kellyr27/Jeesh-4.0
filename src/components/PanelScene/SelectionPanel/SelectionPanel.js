import React, {useState, useEffect} from 'react';
import DirectionSelectors from './DirectionSelectors/DirectionSelectors';
import MoveSelectors from './MoveSelectors/MoveSelectors';
import PanelTexts from './PanelTexts/PanelTexts';
import {updateCardinalDirectionMap} from './SelectionPanel.utils';


const SelectionPanel = ({
    allowedPositions, 
    initialCardinalDirectionMap,
    isPanelLocked,
    panelSize, 
    onMoveSelected,
    onMoveHovered,
    selectorSizes
}) => {
    const [cardinalDirectionMap, setCardinalDirectionMap] = useState(initialCardinalDirectionMap)

    const {
        direction: directionSelectorSize, 
        move: moveSelectorSize, 
        offset: selectorOffsetSize
    } = selectorSizes

    /**
     * Used for reseting the Direction map when a new Soldier is selected
     * to face the direction that the Soldier is currently facing.
     */
    useEffect(() => {
        setCardinalDirectionMap(initialCardinalDirectionMap)
    }, [initialCardinalDirectionMap])


    const handleDirectionSelectorsClick = (cardinalDirection) => {
        const updatedCardinalDirectionMap = updateCardinalDirectionMap(cardinalDirection, cardinalDirectionMap)
        setCardinalDirectionMap(updatedCardinalDirectionMap)
    }

    const handleMoveSelectorsClick = (relativePosition) => {
        onMoveSelected(relativePosition, cardinalDirectionMap.face)
    }

    const handleMoveSelectorsMouseEnter = (relativePosition) => {
        onMoveHovered(relativePosition)
    }

    const handleMoveSelectorsMouseLeave = () => {
        onMoveHovered(null)
    }

    return (
        <>  
            <MoveSelectors
                allowedPositions={allowedPositions} 
                cardinalDirectionMap={cardinalDirectionMap}
                isPanelLocked={isPanelLocked} 
                panelSize={panelSize}
                directionSelectorSize={directionSelectorSize}
                moveSelectorSize={moveSelectorSize}
                selectorOffsetSize={selectorOffsetSize}
                onMoveSelectorsClick={handleMoveSelectorsClick}
                onMoveSelectorsMouseEnter={handleMoveSelectorsMouseEnter}
                onMoveSelectorsMouseLeave={handleMoveSelectorsMouseLeave}
            />
            <DirectionSelectors 
                isPanelLocked={isPanelLocked} 
                panelSize={panelSize}
                directionSelectorSize={directionSelectorSize}
                selectorOffsetSize={selectorOffsetSize}
                onDirectionClick={handleDirectionSelectorsClick}
            />
            <PanelTexts
                cardinalDirectionMap={cardinalDirectionMap}
                isPanelLocked={isPanelLocked} 
                panelSize={panelSize}
                directionSelectorSize={directionSelectorSize}
            />
        </>
    );
};

export default SelectionPanel;