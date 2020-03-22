module.exports.notEmptyObject = (obj) => {
    return Object.keys(obj).length !== 0 && obj.constructor === Object;
}

module.exports.logError = (errObj) => {
    console.log(errObj);
}

module.exports.notEmptyArray = (array) => {
    return (Array.isArray(array) && (array.length > 0)) ? true : false;
}

module.exports.padStr = (input, width, charc='') => {
    return String(input).padStart(width, charc || '0');
};