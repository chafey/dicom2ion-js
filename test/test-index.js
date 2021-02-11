const assert = require('assert')
const dicom2ion = require('./../src/index')
const fs = require('fs')
const path = require('path')
const ion = require("ion-js");

describe('index', async () => {

    before(async() => {
    })

    it('exports', async () => {
        // Arrange

        // Act

        // Assert
        assert.notStrictEqual(dicom2ion, undefined)
    })

    it('exports', async () => {
        // Arrange
        const sourcePath = 'test/fixtures/CT1_UNC'
        //const sourcePath = 'test/fixtures/CT1_UNC.implicit_little_endian.dcm'
        //const sourcePath = 'test/fixtures/CT0012.explicit_little_endian.dcm'
        //const sourcePath = 'test/fixtures/CT0012.fragmented_no_bot_jpeg_ls.80.dcm'
        //const sourcePath = 'test/fixtures/CT0012.not_fragmented_bot_jpeg_ls.80.dcm'
        //const sourcePath = 'test/fixtures/I_000025.dcm'
        //const sourcePath = 'test/fixtures/IM00001.implicit_little_endian.dcm'
        //const sourcePath = 'test/fixtures/test-encapsulated-pdf.dcm'
        const readStream = fs.createReadStream(sourcePath);
        //const writeStream = fs.createWrite

        const sourceInfo = {
            uri: 'file://' + path.join(process.cwd(), sourcePath)
        }

        // Act
        const output = await dicom2ion(readStream, sourceInfo)

        let ionText = ion.dumpPrettyText(output)

        console.log(ionText)

        // Assert
        assert.notStrictEqual(ion, undefined)
    })

})
