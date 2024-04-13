import React from 'react';
import { useControls } from 'leva';

const AxesHelperController = () => {

    const {
        'AxesHelper': showAxesHelper
    } = useControls({
        'AxesHelper': true,
    })

    return (
        <>
            {showAxesHelper && <axesHelper args={[5]} />}
        </>
    );
};

export default AxesHelperController;