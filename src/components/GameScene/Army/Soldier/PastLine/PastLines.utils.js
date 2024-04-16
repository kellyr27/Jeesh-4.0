import { ARENA_OFFSET } from "../../../../../globals"

const offsetLinePoints = (currentLinePoints) => {
    return currentLinePoints
        ? currentLinePoints.map(vector => vector.clone().addScalar(ARENA_OFFSET))
        : null
}

const offsetArrLinePoints = (arrLinePoints) => {
    return arrLinePoints
    ? arrLinePoints.map(linePoints => offsetLinePoints(linePoints))
    : null
}

export {
    offsetLinePoints, 
    offsetArrLinePoints
}