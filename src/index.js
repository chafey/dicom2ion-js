const dicomParser = require('dicom-parser');
const ion = require("ion-js");

const defaultOptions = {
    maximumInlineDataLength : {
        standard: 256,
        private: 256
    }
}

const asyncIterableToBuffer = async (readable) => {
    const chunks = []
    for await (let chunk of readable) {
      chunks.push(chunk)
    }
    return Buffer.concat(chunks)
}

const getVR = (attr) => {
    if(attr.vr) {
        return attr.vr
    }
    // TODO lookup in data dictionary
    return "UN"
}

const attrStringDataToIon = (dataSet, attr) => {
    return dataSet.string(attr.tag)
}

const attrBinaryToIon = (dataSet, attr) => {
    return new Uint8Array(dataSet.byteArray.slice(attr.dataOffset, attr.dataOffset + attr.length))
}

const attrSSDataToIon = (dataSet, attr) => {
    if(attr.length > 2) {
        return attrBinaryToIon(dataSet, attr)
    } else {
        return dataSet.int16(attr.tag)
    }
}

const attrUSDataToIon = (dataSet, attr) => {
    if(attr.length > 2) {
        return attrBinaryToIon(dataSet, attr)
    } else {
        return dataSet.uint16(attr.tag)
    }
}

const attrSLDataToIon = (dataSet, attr) => {
    if(attr.length > 4) {
        return attrBinaryToIon(dataSet, attr)
    } else {
        return dataSet.int32(attr.tag)
    }
}

const attrULDataToIon = (dataSet, attr) => {
    if(attr.length > 2) {
        return attrBinaryToIon(dataSet, attr)
    } else {
        return dataSet.uint16(attr.tag)
    }
}

const attrFLDataToIon = (dataSet, attr) => {
    if(attr.length > 4) {
        return attrBinaryToIon(dataSet, attr)
    } else {
        return dataSet.float(attr.tag)
    }
}
const attrFDDataToIon = (dataSet, attr) => {
    if(attr.length > 8) {
        return attrBinaryToIon(dataSet, attr)
    } else {
        return dataSet.double(attr.tag)
    }
}

const attrDataRefToIon = (dataSet, attr) => {

    return {
        dataOffset: attr.dataOffset,
        length: attr.length,
        vr: attr.vr
    }   
}

const attrATDataToIon = (dataSet, attr) => {
    const group = dataSet.uint16(attr.tag, 0)
    const groupHexStr = ("0000" + group.toString(16)).substr(-4)
    const element = dataSet.uint16(attr.tag, 1)
    const elementHexStr = ("0000" + element.toString(16)).substr(-4)
    return groupHexStr + elementHexStr
}

const attrDataToIon = (dataSet, attr) => {
    if(attr.length == 0) {
        return null
    }
    const vr = getVR(attr)
    switch(vr) {
        case 'AE': 
        case 'AS': 
            return attrStringDataToIon(dataSet, attr)
        case 'AT': 
            return attrATDataToIon(dataSet, attr)
        case 'CS': 
        case 'DA': 
        case 'DS': 
        case 'DT': 
            return attrStringDataToIon(dataSet, attr)
        case 'FL':
            return attrFLDataToIon(dataSet, attr)
        case 'FD':
            return attrFDDataToIon(dataSet, attr)
        case 'IS': 
        case 'LO': 
        case 'LT': 
            return attrStringDataToIon(dataSet, attr)
        case 'OB':
        case 'OF':
        case 'OW':
            return attrBinaryToIon(dataSet, attr)
        case 'PN': 
        case 'SH': 
            return attrStringDataToIon(dataSet, attr)
        case 'SL':
            return attrSLDataToIon(dataSet, attr)
        case 'SS':
            return attrSSDataToIon(dataSet, attr)
        case 'ST': 
        case 'TM': 
        case 'UI': 
            return attrStringDataToIon(dataSet, attr)
        case 'UL':
            return attrULDataToIon(dataSet, attr)
        case 'UN':
            return attrBinaryToIon(dataSet, attr)
        case 'US':
            return attrUSDataToIon(dataSet, attr)
        case 'UT': 
            return attrStringDataToIon(dataSet, attr)
        default:
            return attrDataRefToIon(dataSet, attr)
    }
}

const attrToIon = (dataSet, attr) => {
    if(attr.items) {
        // sequnces
    } else {
        // non sequence item
        if(attr.length < 256) {
            return attrDataToIon(dataSet, attr)
        } else {
            return attrDataRefToIon(dataSet, attr)
        }
    }
}

const uidAttrs = new Map([
    ['00080016', 'SOPClassUID'],
    ['00080018', 'SOPInstanceUID'],
    ['0020000d', 'StudyUID'],
    ['0020000e', 'SeriesUID'],
    ['00020010', 'TransferSyntaxUID'],
    ['00200052', 'FrameOfReferenceUID'],
    ['00080014', 'InstanceCreatorUID'],
])

const patientAttrs = new Map([
    ['00100010', 'PatientName'],
    ['00100020', 'PatientId'],
    ['00100030', 'PatientBirthDate'],
    ['00100040', 'PatientSex'],
])

const studyAttrs = new Map([
    ['00081030', 'StudyDescription'],
    ['00181030', 'ProtocolName'],
    ['00080050', 'AccessionNumber'],
    ['00200010', 'StudyId'],
    ['00080020', 'StudyDate'],
    ['00080030', 'StudyTime'],
])

const seriesAttrs = new Map([
    ['0008103e', 'SeriesDescription'],
    ['00200011', 'SeriesNumber'],
    ['00080060', 'Modality'],
    ['00180015', 'BodyPart'],
    ['00080021', 'SeriesDate'],
    ['00080031', 'SeriesTime'],

])

const instanceAttrs = new Map([
    ['00200013', 'InstanceNumber'],
    ['00200012', 'AcquisitionNumber'],
    ['00080012', 'InstanceCreationDate'],
    ['00080013', 'InstanceCreationTime'],
    ['00080022', 'AcquisitionDate'],
    ['00080032', 'AcquisitionTime'],
    ['00080023', 'ContentDate'],
    ['00080033', 'ContentTime'],
    ['00080005', 'SpecificCharacterSet']
])

const imageAttrs = new Map([
    ['00280010', 'Rows'],
    ['00280011', 'Columns'],
    ['00280004', 'PhotometricInterpretation'],
    ['00080008', 'ImageType'],
    ['00280100', 'BitsAllocated'],
    ['00280101', 'BistStored'],
    ['00280102', 'HighBit'],
    ['00280103', 'PixelRepresentation'],
    ['00281053', 'RescaleSlope'],
    ['00281052', 'RescaleIntercept'],
    ['00200032', 'ImagePositionPatient'],
    ['00200037', 'ImageOrientationPatient'],
    ['00280030', 'PixelSpacing'],
    ['00280002', 'SamplesPerPixel'],
])


const equipmentAttrs = new Map([
    ['00080070', 'Manufacturer'],
    ['00081090', 'Model'],
    ['00081010', 'StationName'],
    ['00020016', 'AETitle'],
    ['00080080', 'InstituionName'],
    ['00080080', 'SoftwareVersion'],
    ['00020013', 'ImplementationVersionName']
])

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

        if(uidAttrs.has(tag)) {
            ionDataSet.uidAttrs[uidAttrs.get(tag)] = attrToIon(dataSet, attr)
        } else if(patientAttrs.has(tag)) {
            ionDataSet.patientAttrs[patientAttrs.get(tag)] = attrToIon(dataSet, attr)
        } else if(studyAttrs.has(tag)) {
            ionDataSet.studyAttrs[studyAttrs.get(tag)] = attrToIon(dataSet, attr)
        } else if(seriesAttrs.has(tag)) {
            ionDataSet.seriesAttrs[seriesAttrs.get(tag)] = attrToIon(dataSet, attr)
        } else if(instanceAttrs.has(tag)) {
            ionDataSet.instanceAttrs[instanceAttrs.get(tag)] = attrToIon(dataSet, attr)
        } else if(imageAttrs.has(tag)) {
            ionDataSet.imageAttrs[imageAttrs.get(tag)] = attrToIon(dataSet, attr)
        } else if(equipmentAttrs.has(tag)) {
            ionDataSet.equipmentAttrs[equipmentAttrs.get(tag)] = attrToIon(dataSet, attr)
        } else if(dicomParser.isPrivateTag(attr.tag)) {
            ionDataSet.privateAttrs[tag] = attrToIon(dataSet, attr)
        } else {
            ionDataSet.standardAttrs[tag] = attrToIon(dataSet, attr)
        }
    })
    return ionDataSet
}

/**
 * 
 * @param {*} readable - async iterator source
 * @param {*} sourceUri 
 * @param {*} options 
 */

const dicom2ion = async (readable, sourceUri, options = defaultOptions) => {

    // read into a buffer since dicomParser does not support streaming
    const buffer = await asyncIterableToBuffer(readable)

    // parse the dicom file
    console.time('parse dicom')
    const dataSet = dicomParser.parseDicom(buffer)
    console.timeEnd('parse dicom')

    //console.log(dataSet.byteArray.buffer)

    const inlinedDataSet = dataSetToIon(dataSet)

    const output = {
        fileInfo: {
        },
        dataSet: inlinedDataSet
    }

    console.time('encode ion')
    let ionText = ion.dumpPrettyText(output)
    console.timeEnd('encode ion')
 
    return ionText
}

module.exports = dicom2ion