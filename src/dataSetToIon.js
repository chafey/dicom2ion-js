const dicomParser = require('dicom-parser');
const attrToIon = require('./attrToIon')
const attrGroups = require('./attrGroups')

const dataSetToIon = (dataSet) => {
    const sortedKeys = Object.keys(dataSet.elements).sort()
    const ionDataSet = {
        vrs: {},
        groups: {
            standardAttrs: {},
            privateAttrs: {}
        }
    }

    sortedKeys.map((key) => {
        const attr = dataSet.elements[key]
        //console.log('attr=',attr)
        const tag = attr.tag.substring(1) // trim leading 'x'
 
        // store vrs separately from attribute values
        if(attr.vr) {
            if (dicomParser.isPrivateTag(attr.tag)) {
                ionDataSet.vrs[tag] = attr.vr
            }
            // TODO: add VR's for those that match multiple or are not in data dictionary
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
                ionDataSet.groups.privateAttrs[tag] = attrToIon(dataSet, attr)
            } else {
                ionDataSet.groups.standardAttrs[tag] = attrToIon(dataSet, attr)
            }
        }
    })
    return ionDataSet
}

module.exports = dataSetToIon