const dicomParser = require('dicom-parser');
const ion = require("ion-js");
const asyncIterableToBuffer = require('./asyncIterableToBuffer')
const defaultOptions = require('./defaultOptions')
const dataSetToIon = require('./dataSetToIon')
const getHash = require('./getHash')
const fs = require('fs')
const util = require('util')
const timestampNow = require('./timestampNow')
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
            createdAt: timestampNow()
        },
        dataSet: ionDataSet
    }
 
    return output
}

module.exports = dicom2ion