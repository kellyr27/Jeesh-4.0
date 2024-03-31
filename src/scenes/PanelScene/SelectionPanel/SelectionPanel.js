import React, {useEffect} from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import DirectionSelectors from './components/DirectionSelectors';
import MoveSelectors from './components/MoveSelectors';


const SelectionPanel = () => {




    const [panelSize, setPanelSize] = React.useState(250)
    const [directionSelectorSize, setDirectionSelectorSize] = React.useState(40)
    const [moveSelectorSize, setMoveSelectorSize] = React.useState(50)
    const [selectorOffsetSize, setSelectorOffsetSize] = React.useState(5)

    return (
        <>
            <MoveSelectors
                panelSize={panelSize}
                directionSelectorSize={directionSelectorSize}
                moveSelectorSize={moveSelectorSize}
                selectorOffsetSize={selectorOffsetSize}
            />
            <DirectionSelectors 
                panelSize={panelSize} 
                directionSelectorSize={directionSelectorSize} 
                moveSelectorSize={moveSelectorSize} 
                selectorOffsetSize={selectorOffsetSize} 
            />
        </>
    );
};

export default SelectionPanel;