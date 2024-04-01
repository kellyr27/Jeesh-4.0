// Subtracts arr2 from arr1 and returns the result
const subtractArrays = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return console.error('Arrays must be of the same length')
    }

    return arr1.map((el, index) => {
        return el - arr2[index]
    })
}

const addArrays = (...arrays) => {
    const length = arrays[0].length;

    // Check if all arrays have the same length
    if (!arrays.every(arr => arr.length === length)) {
        return console.error('All arrays must be of the same length');
    }

    return arrays[0].map((_, index) => {
        return arrays.reduce((sum, arr) => sum + arr[index], 0);
    });
};

const equalArrays = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return console.error('Arrays must be of the same length')
    }

    return arr1.every((el, index) => {
        return el === arr2[index]
    })
}

export { subtractArrays, addArrays, equalArrays }