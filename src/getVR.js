const dataDictionary = require('./dataDictionary')

const getVR = (attr) => {
    if(attr.vr) {
        return attr.vr
    }
    // TODO lookup in data dictionary
    const dataDictAttr = dataDictionary[attr.tag.substring(1)]
    if(dataDictAttr) {
        return dataDictAttr.vr
    }
    return "UN"
}

module.exports = getVR