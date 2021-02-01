const assert = require('assert')
const dicom2ion = require('./../src/index')
const fs = require('fs')
const path = require('path')

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
        //const sourceUri = 'test/fixtures/CT1_UNC'
        //const sourceUri = 'test/fixtures/CT1_UNC.implicit_little_endian.dcm'
        //const sourceUri = 'test/fixtures/CT0012.explicit_little_endian.dcm'
        //const sourceUri = 'test/fixtures/CT0012.fragmented_no_bot_jpeg_ls.80.dcm'
        const sourcePath = 'test/fixtures/CT0012.not_fragmented_bot_jpeg_ls.80.dcm'
        const readStream = fs.createReadStream(sourcePath);
        //const writeStream = fs.createWrite

        const sourceInfo = {
            uri: 'file://' + path.join(process.cwd(), sourcePath)
        }

        // Act
        const ion = await dicom2ion(readStream, sourceInfo)
        console.log(ion)

        // Assert
        assert.notStrictEqual(ion, undefined)
    })

})
