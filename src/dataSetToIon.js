const dicomParser = require('dicom-parser');
const attrToIon = require('./attrToIon')
const attrGroups = require('./attrGroups')
const getVR = require('./getVR')

const dataSetToIon = (dataSet) => {
    const ionDataSet = {
        groups: {
        },
        standardAttrs: {},
        privateAttrs: {},
        vrs: {}
    }

    // add objects for each attribute group to the ionDataSet so we can control the order
    Object.keys(attrGroups).map((key) => {
        ionDataSet.groups[key] = {}
    })
    
    // iterate through the attributes in the dataset and map them to ion
    const sortedKeys = Object.keys(dataSet.elements).sort()
    sortedKeys.map((key) => {
        const attr = dataSet.elements[key]
        //console.log('attr=',attr)
        const tag = attr.tag.substring(1) // trim leading 'x'
 
        // store vrs separately from attribute values
        if(attr.vr) {
            if (dicomParser.isPrivateTag(attr.tag)) {
                ionDataSet.vrs[tag] = attr.vr
            }
            const vr = getVR(attr)
            if(vr === 'UN' || vr.includes('|')) {
                ionDataSet.vrs[tag] = attr.vr
            }
        }

        let found = false
        Object.keys(attrGroups).map((key) => {
            const group = attrGroups[key]
            if(group.has(tag)) {
                if(ionDataSet.groups[key] === undefined) {
                    ionDataSet.groups[key] = {}
                }
                ionDataSet.groups[key][group.get(tag)] = attrToIon(dataSet, attr)
                found = true
            }
        })

        if(found === false) {
            if(dicomParser.isPrivateTag(attr.tag)) {
                ionDataSet.privateAttrs[tag] = attrToIon(dataSet, attr)
            } else {
                ionDataSet.standardAttrs[tag] = attrToIon(dataSet, attr)
            }
        }
    })
    return ionDataSet
}

module.exports = dataSetToIon