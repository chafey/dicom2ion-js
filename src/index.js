const dicomParser = require('dicom-parser');
const ion = require("ion-js");
const asyncIterableToBuffer = require('./asyncIterableToBuffer')
const defaultOptions = require('./defaultOptions')
const dataSetToIon = require('./dataSetToIon')
const getHash = require('./getHash')


/**
 * 
 * @param {*} readable - async iterator source
 * @param {*} sourceUri 
 * @param {*} options 
 */

const dicom2ion = async (readable, sourceUri, options = defaultOptions) => {

    // read into a buffer since dicomParser does not support streaming
    const buffer = await asyncIterableToBuffer(readable)

    // calculate the sha 256 hash
    let digest = getHash(buffer.buffer);

    // parse the dicom file
    console.time('parse dicom')
    const dataSet = dicomParser.parseDicom(buffer)
    console.timeEnd('parse dicom')

    //console.log(dataSet.byteArray.buffer)

    const inlinedDataSet = dataSetToIon(dataSet)

    const output = {
        fileInfo: {
            sha256: digest
        },
        dataSet: inlinedDataSet
    }

    console.time('encode ion')
    let ionText = ion.dumpPrettyText(output)
    console.timeEnd('encode ion')
 
    return ionText
}

module.exports = dicom2ion