const getVR = (attr) => {
    if(attr.vr) {
        return attr.vr
    }
    // TODO lookup in data dictionary
    return "UN"
}

module.exports = getVR