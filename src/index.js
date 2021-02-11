const dicomParser = require('dicom-parser');
const ion = require("ion-js");
const asyncIterableToBuffer = require('./asyncIterableToBuffer')
const defaultOptions = require('./defaultOptions')
const dataSetToIon = require('./dataSetToIon')
const getHash = require('./getHash')
const fs = require('fs')
const util = require('util')
const timestampNow = require('./timestampNow')

// NOTE - dicom-parser actually knows this but does not store/expose it - would be nice to modify
// it someday so we don't need to do this
const findLastP10HeaderAttribute = (dataSet) => {
    const p10HeaderTags = Object.keys(dataSet.elements).filter(tag => tag.substr(1,4) === '0002')
    const p10HeaderTagsReverseSorted = p10HeaderTags.sort().reverse()
    return p10HeaderTagsReverseSorted[0]
}

const getDataSetOffset = (dataSet) => {
    const lastP10HeaderTag = findLastP10HeaderAttribute(dataSet)
    const lastP10HeaderAttribute = dataSet.elements[lastP10HeaderTag]
    const dataSetOffset =  lastP10HeaderAttribute.dataOffset + lastP10HeaderAttribute.length
    return dataSetOffset
}

/**
 * 
 * @param {*} readable - async iterator source
 * @param {*} sourceInfo 
 * @param {*} options 
 */

const dicom2ion = async (readable, sourceInfo, options = defaultOptions) => {

    // read into a buffer since dicomParser does not support streaming
    const buffer = await asyncIterableToBuffer(readable)

    // calculate the sha 256 hash
    let digest = getHash(buffer.buffer);

    // parse the dicom file
    const dataSet = dicomParser.parseDicom(buffer)
    
    const ionDataSet = dataSetToIon(dataSet, options)

    const output = {
        sourceInfo,
        options,
        fileInfo: {
            sha256: digest,
            createdAt: timestampNow(),
            dataSetOffset: getDataSetOffset(dataSet)
        },
        dataSet: ionDataSet
    }
 
    return output
}

module.exports = dicom2ion