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
    console.time('parse dicom')
    const dataSet = dicomParser.parseDicom(buffer)
    console.timeEnd('parse dicom')

    const ionDataSet = dataSetToIon(dataSet)

    const output = {
        sourceInfo,
        options,
        fileInfo: {
            sha256: digest,
            createdAt: timestampNow()
        },
        dataSet: ionDataSet
    }

    //console.log(JSON.stringify(output, null, 4));
    //console.log(output)
    //console.log(util.inspect(output, {showHidden: false, depth: null}))

    //fs.writeFileSync('output.json', util.inspect(output, {showHidden: false, depth: null}))

    console.time('encode ion')
    let ionText = ion.dumpPrettyText(output)
    console.timeEnd('encode ion')
 
    return ionText
}

module.exports = dicom2ion