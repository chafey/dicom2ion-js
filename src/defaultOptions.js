const getHash = require('./getHash')
const dataDictionary = require('./dataDictionary')

const defaultOptions = {
    maximumInlineDataLength: 256,
    dataDictionary: {
        description: "Unknown edition",
        sha256: getHash(dataDictionary),
    }
}

module.exports = defaultOptions