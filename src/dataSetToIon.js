const dicomParser = require('dicom-parser');
const attrToIon = require('./attrToIon')
const attrGroups = require('./attrGroups')
const getVR = require('./getVR')
const getKeyword = require('./getKeyword');
const orderedAttributes = require('./orderedAttributes');

const attributeToIon = (ionDataSet, vrs, tag, dataSet, attr) => {
    // store vrs separately from attribute values
    if(attr.vr) {
        if (dicomParser.isPrivateTag(attr.tag)) {
            vrs[tag] = attr.vr
        }
        const vr = getVR(attr)
        if(vr === 'UN' || vr.includes('|')) {
            vrs[tag] = attr.vr
        }
    }

    const keyword = getKeyword(attr)

    if(dicomParser.isPrivateTag(attr.tag)) {
        ionDataSet[tag] = attrToIon(dataSet, attr, dataSetToIon)
    } else {
        ionDataSet[keyword] = attrToIon(dataSet, attr, dataSetToIon)
    }
}

const dataSetToIon = (dataSet) => {

    const vrs = {}

    const ionDataSet = {}
   
    // do ordered attributes first
    orderedAttributes.map((tag) => {
        const attr = dataSet.elements['x' + tag]
        if(attr) {
            attributeToIon(ionDataSet, vrs, tag, dataSet, attr)
        }
    })

    // iterate through the attributes in the dataset and map them to ion
    const keys = Object.keys(dataSet.elements)
    keys.map((key) => {
        const attr = dataSet.elements[key]
        const tag = attr.tag.substring(1) // trim leading 'x'
 
        if(orderedAttributes.includes(tag)) {
            return
        }

        attributeToIon(ionDataSet, vrs, tag, dataSet, attr)
    })

    if(Object.keys(vrs).length != 0){
        ionDataSet._vrs = vrs
    }

    return ionDataSet
}

module.exports = dataSetToIon