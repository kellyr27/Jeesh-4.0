// const getPointsUpToT = (movePath, t, numPoints = 10) => {
//     const points = [];
//     for (let i = 0; i < numPoints; i += 1) {
//         points.push(movePath.getPointAt(i / numPoints ));
//     }
//     return points;
// }

function getPointsUpToT(movePath, t, numPoints = 10) {

    if (!movePath || numPoints <= 0 || t <= 0) {
        return null
    }

    const points = [];

    for (let i = 0; i < numPoints; i++) {
        
        let t1 = (i / (numPoints - 1)) * t;
        t1 = Math.min(t1, 1)

        const point = movePath.getPointAt(t1);

        points.push(point);
    }


    return points;
}

export {
    getPointsUpToT
}