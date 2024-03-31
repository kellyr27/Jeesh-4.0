import React, {useEffect} from 'react';
import {useControls, folder} from 'leva';
import DirectionSelectors from './components/DirectionSelectors';
import MoveSelectors from './components/MoveSelectors';
import PanelTexts from './components/PanelText';


const SelectionPanel = ({allowedPositions, directionMap, setDirectionMap, isPanelLocked}) => {


    const { panelSize, directionSelectorSize, moveSelectorSize, selectorOffsetSize } = useControls('Selection Panel', {
        'Size Adjustments': folder({
            panelSize: {
                value: 250,
                min: 100,
                max: 500,
                step: 1
            },
            directionSelectorSize: {
                value: 40,
                min: 10,
                max: 100,
                step: 1
            },
            moveSelectorSize: {
                value: 50,
                min: 10,
                max: 100,
                step: 1
            },
            selectorOffsetSize: {
                value: 5,
                min: 1,
                max: 20,
                step: 1
            }
        })
    })


    // TODO: Implement useWatch 

    return (
        <>  
            <MoveSelectors
                panelSize={panelSize}
                directionSelectorSize={directionSelectorSize}
                moveSelectorSize={moveSelectorSize}
                selectorOffsetSize={selectorOffsetSize}
                directionMap={directionMap}
                allowedPositions={allowedPositions}
                isPanelLocked={isPanelLocked}
            />
            <DirectionSelectors 
                panelSize={panelSize} 
                directionSelectorSize={directionSelectorSize} 
                moveSelectorSize={moveSelectorSize} 
                selectorOffsetSize={selectorOffsetSize}
                directionMap={directionMap}
                setDirectionMap={setDirectionMap}
                isPanelLocked={isPanelLocked}
            />
            <PanelTexts
                panelSize={panelSize}
                directionSelectorSize={directionSelectorSize}
                moveSelectorSize={moveSelectorSize}
                selectorOffsetSize={selectorOffsetSize}
                directionMap={directionMap}
                setDirectionMap={setDirectionMap}
                isPanelLocked={isPanelLocked}
            />
        </>
    );
};

export default SelectionPanel;