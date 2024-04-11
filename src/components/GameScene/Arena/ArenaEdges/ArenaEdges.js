import {Line} from '@react-three/drei';
import { useState } from "react";
import {getEdgeEndPoints} from '../../../../utils/displayHelpers';

const ArenaEdges = ({edge}) => {

    console.log(edge)

    return (
        <>
            {/* {edges.map((edge, index) => {
                
                return (
                    <>
                    {edge ? (
                        <Line
                          key={index}
                          points={getEdgeEndPoints(edge[0][0], edge[0][1])}
                          color='red'
                          linewidth={1}
                        />
                      ) : null}
                    </>
                )
            })} */}
        </>
    )
}

export default ArenaEdges;