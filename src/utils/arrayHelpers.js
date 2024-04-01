// Subtracts arr2 from arr1 and returns the result
const subtractArrays = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return console.error('Arrays must be of the same length')
    }

    return arr1.map((el, index) => {
        return el - arr2[index]
    })
}

const addArrays = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return console.error('Arrays must be of the same length')
    }

    return arr1.map((el, index) => {
        return el + arr2[index]
    })
}

const equalArrays = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return console.error('Arrays must be of the same length')
    }

    return arr1.every((el, index) => {
        return el === arr2[index]
    })
}

export { subtractArrays, addArrays, equalArrays }