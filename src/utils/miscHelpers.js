/**
 * Check all all properties of an object are not null
 */
function allPropertiesNotNull(obj) {
    return Object.values(obj).every(value => value !== null);
}

export {
    allPropertiesNotNull
}