import React, {useState, useEffect} from 'react';
import { useControls, folder } from 'leva';

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