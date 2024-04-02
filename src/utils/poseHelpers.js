import { equalArrays } from './arrayHelpers'

const checkIfPositionInArray = (position, array) => {
    return array.some((element) => {
        return element[0] === position[0] && element[1] === position[1] && element[2] === position[2]
    })
}

const poseInArray = (checkPose, posesList) => {

    for (const pose of posesList) {
        if (equalArrays(pose.position, checkPose.position) && (pose.direction === checkPose.direction)) {
            return true
        }
    }
    return false

}

export { checkIfPositionInArray, poseInArray }