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

const inlineDataSet = (dataSet) => {
    const sortedKeys = Object.keys(dataSet.elements).sort()
    const inlineDataSet = sortedKeys.map((key) => {
        const attr = dataSet.elements[key]
        //console.log('attr=',attr)
        const inlinedAttr = {
            tag: attr.tag,
            vr: attr.vr,
            length: attr.length
        }
        if(attr.hadUndefinedLength) {
            inlinedAttr.hadUndefinedLength = true
        }
        if(attr.items) {
            // sequnces
        } else {
            // non sequence item
            if(attr.length < 256) {
                inlinedAttr.data = dataSet.byteArray.slice(attr.dataOffset, attr.length)
            } else {
                inlinedAttr.dataOffset = attr.dataOffset
            }
        }
        console.log(inlinedAttr)
        return inlinedAttr
    })
    return inlineDataSet
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
    const dataSet = dicomParser.parseDicom(buffer)

    console.log(dataSet)

    const inlinedDataSet = inlineDataSet(dataSet)

    const output = {
        fileInfo: {
        },
        dataSet: inlinedDataSet
    }

    return output
}

module.exports = dicom2ion