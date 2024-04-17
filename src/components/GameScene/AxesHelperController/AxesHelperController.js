import React from 'react';
import useDisplayAxesControls from '../../../controls/useDisplayAxesControls';
import { ARENA_LENGTH } from '../../../globals';

const AxesHelperController = () => {

    const showAxesHelper = useDisplayAxesControls();

    return (
        <>
            {showAxesHelper && <axesHelper args={[ARENA_LENGTH / 2 + 1]} />}
        </>
    );
};

export default AxesHelperController;