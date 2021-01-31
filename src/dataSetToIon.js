const dicomParser = require('dicom-parser');
const attrToIon = require('./attrToIon')
const attrGroups = require('./attrGroups')
const getVR = require('./getVR')

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
                ionDataSet.groups.privateAttrs[tag] = attrToIon(dataSet, attr)
            } else {
                ionDataSet.groups.standardAttrs[tag] = attrToIon(dataSet, attr)
            }
        }
    })
    return ionDataSet
}

module.exports = dataSetToIon