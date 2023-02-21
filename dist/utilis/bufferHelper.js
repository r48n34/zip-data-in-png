"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.centralDirStartOffset = exports.endCentralDirOffsetRindex = exports.len_to_bytes_little = exports.len_to_bytes = exports.int_from_bytes_little = exports.int_from_bytes = exports.zipfileGetCounter = void 0;
const adm_zip_1 = __importDefault(require("adm-zip"));
function zipfileGetCounter(zipFile) {
    const zip = new adm_zip_1.default(zipFile);
    const zipEntries = zip.getEntries(); // an array of ZipEntry records
    // console.log(zipEntries);
    return zipEntries.length;
}
exports.zipfileGetCounter = zipfileGetCounter;
// https://stackoverflow.com/questions/54257476/is-there-any-function-in-js-like-this-int-from-bytes-in-python
function int_from_bytes(bufferArray) {
    return bufferArray.readUInt32BE(0);
}
exports.int_from_bytes = int_from_bytes;
function int_from_bytes_little(bufferArray) {
    const buf = Buffer.from(bufferArray.reverse());
    return buf.readUInt32BE(0);
}
exports.int_from_bytes_little = int_from_bytes_little;
function len_to_bytes(num) {
    let b = new ArrayBuffer(4);
    new DataView(b).setUint32(0, num);
    const data = Array.from(new Uint8Array(b));
    return data;
}
exports.len_to_bytes = len_to_bytes;
function len_to_bytes_little(num, bytesCount = 4) {
    return len_to_bytes(num).reverse().filter((_, i) => i < bytesCount);
}
exports.len_to_bytes_little = len_to_bytes_little;
function endCentralDirOffsetRindex(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i] === 80
            && data[i + 1] === 75
            && data[i + 2] === 5
            && data[i + 3] === 6) {
            return i;
        }
    }
    return -1;
}
exports.endCentralDirOffsetRindex = endCentralDirOffsetRindex;
function centralDirStartOffset(data, offset) {
    for (let i = offset; i < data.length; i++) {
        if (data[i] === 80
            && data[i + 1] === 75
            && data[i + 2] === 1
            && data[i + 3] === 2) {
            return i;
        }
    }
    return -1;
}
exports.centralDirStartOffset = centralDirStartOffset;
//# sourceMappingURL=bufferHelper.js.map