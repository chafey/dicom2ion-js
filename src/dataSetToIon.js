const dicomParser = require('dicom-parser');
const attrToIon = require('./attrToIon')
const attrGroups = require('./attrGroups')

const dataSetToIon = (dataSet) => {
    const sortedKeys = Object.keys(dataSet.elements).sort()
    const ionDataSet = {
        vrs: {},
        uidAttrs: {},
        patientAttrs: {},
        studyAttrs: {},
        seriesAttrs: {},
        instanceAttrs: {},
        imageAttrs: {},
        equipmentAttrs: {},
        standardAttrs: {},
        privateAttrs: {},

    }
    // TODO: consider smart grouping of attributes (e.g. patient, uids, study)
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

        if(attrGroups.uidAttrs.has(tag)) {
            ionDataSet.uidAttrs[attrGroups.uidAttrs.get(tag)] = attrToIon(dataSet, attr)
        } else if(attrGroups.patientAttrs.has(tag)) {
            ionDataSet.patientAttrs[attrGroups.patientAttrs.get(tag)] = attrToIon(dataSet, attr)
        } else if(attrGroups.studyAttrs.has(tag)) {
            ionDataSet.studyAttrs[attrGroups.studyAttrs.get(tag)] = attrToIon(dataSet, attr)
        } else if(attrGroups.seriesAttrs.has(tag)) {
            ionDataSet.seriesAttrs[attrGroups.seriesAttrs.get(tag)] = attrToIon(dataSet, attr)
        } else if(attrGroups.instanceAttrs.has(tag)) {
            ionDataSet.instanceAttrs[attrGroups.instanceAttrs.get(tag)] = attrToIon(dataSet, attr)
        } else if(attrGroups.imageAttrs.has(tag)) {
            ionDataSet.imageAttrs[attrGroups.imageAttrs.get(tag)] = attrToIon(dataSet, attr)
        } else if(attrGroups.equipmentAttrs.has(tag)) {
            ionDataSet.equipmentAttrs[attrGroups.equipmentAttrs.get(tag)] = attrToIon(dataSet, attr)
        } else if(dicomParser.isPrivateTag(attr.tag)) {
            ionDataSet.privateAttrs[tag] = attrToIon(dataSet, attr)
        } else {
            ionDataSet.standardAttrs[tag] = attrToIon(dataSet, attr)
        }
    })
    return ionDataSet
}

module.exports = dataSetToIon