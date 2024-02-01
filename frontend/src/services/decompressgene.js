const pako = require('pako');

function base64Decode(encoded) {
    return atob(encoded);
}

function decompress(encoded) {
    const compressedData = base64Decode(encoded);
    const uint8Array = new Uint8Array(
        compressedData.split('').map((char) => char.charCodeAt(0))
    );
    const decompressedData = pako.inflate(uint8Array, { to: 'string' });
    return decompressedData;
}

module.exports = {
    decompress,
};
