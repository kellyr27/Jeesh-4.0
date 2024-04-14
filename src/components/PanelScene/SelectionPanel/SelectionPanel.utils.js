import { getOpposingDirection } from "../../../utils/directionHelpers"
import {getRelativeDirectionArray} from '../../../utils/directionHelpers';
import { addArrays } from "../../../utils/arrayHelpers";

const isValidCardinalDirection = (cardinalDirection) => {
    return ['up', 'down', 'left', 'right'].includes(cardinalDirection)
}

const isValidCardinalDirectionMap = (cardinalDirectionMap) => {
    return (
        typeof cardinalDirectionMap === 'object' &&
        'face' in cardinalDirectionMap &&
        'left' in cardinalDirectionMap &&
        'right' in cardinalDirectionMap &&
        'up' in cardinalDirectionMap &&
        'down' in cardinalDirectionMap
    )
}

/**
 * This function takes a selected direction and the current direction map as input and returns an updated direction map.
 * The selected direction should be one of 'up', 'down', 'left', or 'right'.
 * The current direction map should be an object with keys 'face', 'left', 'right', 'up', and 'down', each mapping to a direction string.
 * The function updates the direction map based on the selected direction and the getOpposingDirection function.
 * For example, if the selected direction is 'up', the function will update the 'face' and 'down' directions in the map.
 *
 * @param {string} selectedCardinalDirection - The selected direction. Should be one of 'up', 'down', 'left', or 'right'.
 * @param {object} currentCardinalDirectionMap - The current direction map. Should be an object with keys 'face', 'left', 'right', 'up', and 'down'.
 * @returns {object} The updated direction map.
 * @throws {Error} Will throw an error if the selected direction is not one of 'up', 'down', 'left', or 'right', or if the current direction map is not an object with the correct keys.
 */
const updateCardinalDirectionMap = (selectedCardinalDirection, currentCardinalDirectionMap) => {
    
    if (!isValidCardinalDirection(selectedCardinalDirection)) {
        throw new Error('Invalid cardinal direction. Expected one of "up", "down", "left", "right".')
    }

    if (!isValidCardinalDirectionMap(currentCardinalDirectionMap)) {
        throw new Error('Invalid cardinal direction map. Expected an object with keys "face", "left", "right", "up", and "down".')
    }
    
    if (selectedCardinalDirection === 'up') {
        return {
            face: currentCardinalDirectionMap.up,
            left: currentCardinalDirectionMap.left,
            right: currentCardinalDirectionMap.right,
            up: getOpposingDirection(currentCardinalDirectionMap.face),
            down: currentCardinalDirectionMap.face
        }
    } else if (selectedCardinalDirection === 'down') {
        return {
            face: currentCardinalDirectionMap.down,
            left: currentCardinalDirectionMap.left,
            right: currentCardinalDirectionMap.right,
            up: currentCardinalDirectionMap.face,
            down: getOpposingDirection(currentCardinalDirectionMap.face)
        }
    } else if (selectedCardinalDirection === 'left') {
        return {
            face: currentCardinalDirectionMap.left,
            left: getOpposingDirection(currentCardinalDirectionMap.face),
            right: currentCardinalDirectionMap.face,
            up: currentCardinalDirectionMap.up,
            down: currentCardinalDirectionMap.down
        }
    } else if (selectedCardinalDirection === 'right') {
        return {
            face: currentCardinalDirectionMap.right,
            left: currentCardinalDirectionMap.face,
            right: getOpposingDirection(currentCardinalDirectionMap.face),
            up: currentCardinalDirectionMap.up,
            down: currentCardinalDirectionMap.down
        }
    }
}

/**
 * This function calculates the relative position based on the given offsets and direction map.
 * The offsets are integers representing the change in position along the x and y axes.
 * The direction map is an object with keys 'face', 'left', 'right', 'up', and 'down', each mapping to a direction string.
 * The function uses the offsets and the direction map to calculate the relative position.
 * For example, if the offsets are -1 and -1, the function will add the arrays corresponding to the 'left', 'up', and 'face' directions.
 *
 * @param {number} xOffset - The offset along the x axis. Should be -1, 0, or 1.
 * @param {number} yOffset - The offset along the y axis. Should be -1, 0, or 1.
 * @param {object} cardinalDirectionMap - The direction map. Should be an object with keys 'face', 'left', 'right', 'up', and 'down'.
 * @returns {Array} The relative position as an array.
 * @throws {Error} Will throw an error if the offsets are not -1, 0, or 1, or if the direction map is not an object with the correct keys.
 */
const getRelativePosition = (xOffset, yOffset, cardinalDirectionMap) => {

    if (![-1, 0, 1].includes(xOffset) || ![-1, 0, 1].includes(yOffset)) {
        throw new Error('Invalid offset. Expected -1, 0, or 1.')
    }
    if (!isValidCardinalDirectionMap(cardinalDirectionMap)) {
        throw new Error('Invalid direction map. Expected an object with keys "face", "left", "right", "up", and "down".')
    }
    

    if (xOffset === -1 && yOffset === -1) {
        return addArrays(getRelativeDirectionArray(cardinalDirectionMap.left), getRelativeDirectionArray(cardinalDirectionMap.up), getRelativeDirectionArray(cardinalDirectionMap.face))
    } else if (xOffset === 0 && yOffset === -1) {
        return addArrays(getRelativeDirectionArray(cardinalDirectionMap.up), getRelativeDirectionArray(cardinalDirectionMap.face))
    } else if (xOffset === 1 && yOffset === -1) {
        return addArrays(getRelativeDirectionArray(cardinalDirectionMap.right), getRelativeDirectionArray(cardinalDirectionMap.up), getRelativeDirectionArray(cardinalDirectionMap.face))
    } else if (xOffset === -1 && yOffset === 0) {
        return addArrays(getRelativeDirectionArray(cardinalDirectionMap.left), getRelativeDirectionArray(cardinalDirectionMap.face))
    } else if (xOffset === 0 && yOffset === 0) {
        return addArrays(getRelativeDirectionArray(cardinalDirectionMap.face))
    } else if (xOffset === 1 && yOffset === 0) {
        return addArrays(getRelativeDirectionArray(cardinalDirectionMap.right), getRelativeDirectionArray(cardinalDirectionMap.face))
    } else if (xOffset === -1 && yOffset === 1) {
        return addArrays(getRelativeDirectionArray(cardinalDirectionMap.left), getRelativeDirectionArray(cardinalDirectionMap.down), getRelativeDirectionArray(cardinalDirectionMap.face))
    } else if (xOffset === 0 && yOffset === 1) {
        return addArrays(getRelativeDirectionArray(cardinalDirectionMap.down), getRelativeDirectionArray(cardinalDirectionMap.face))
    } else if (xOffset === 1 && yOffset === 1) {
        return addArrays(getRelativeDirectionArray(cardinalDirectionMap.right), getRelativeDirectionArray(cardinalDirectionMap.down), getRelativeDirectionArray(cardinalDirectionMap.face))
    }
}

export {
    updateCardinalDirectionMap,
    getRelativePosition
}