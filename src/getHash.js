let ionHash = require('ion-hash-js');

function toHexString(byteArray) {
    let sb = '';
    byteArray.forEach(b => {
        if (sb != '') { sb += '' }
        sb += ('0' + (b & 0xFF).toString(16)).slice(-2);
    });
    return sb;
}

const getHash = (data) => {
    const digest = ionHash.digest(data, 'sha256');
    return toHexString(digest)
}

module.exports = getHash