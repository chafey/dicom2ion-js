const assert = require('assert')
const dicom2ion = require('./../src/index')
const fs = require('fs')

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
        const sourceUri = 'test/fixtures/CT0012.explicit_little_endian.dcm'
        const readStream = fs.createReadStream(sourceUri);
        //const writeStream = fs.createWrite

        // Act
        const ion = await dicom2ion(readStream)
        console.log(ion)

        // Assert
        assert.notStrictEqual(ion, undefined)
    })

})
