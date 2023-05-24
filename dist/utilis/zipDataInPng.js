"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zipDataInPng = exports.pngAddHiddenContent = void 0;
const fs_1 = __importDefault(require("fs"));
const buffer_crc32_1 = __importDefault(require("buffer-crc32"));
const node_buffer_1 = require("node:buffer");
const checkIsPng_1 = require("./checkIsPng");
const bufferHelper_1 = require("./bufferHelper");
// Input the png buffer, and hide a zip file in the png raw data
function pngAddHiddenContent(png_in, // Png file
content_in, // Zip file
option) {
    let finalOptions = Object.assign({ quiet: true }, option);
    let utf8Encode = new TextEncoder();
    let png_out = [137, 80, 78, 71, 13, 10, 26, 10]; // Uint8Array at final, png header at init
    let idat_body = [];
    let width = 0;
    let height = 0;
    let i = 8;
    while (true) {
        let chunk_len_raw = png_in.subarray(i, i + 4);
        let chunk_len = (0, bufferHelper_1.int_from_bytes)(chunk_len_raw); // int.from_bytes
        let chunk_type = png_in.subarray(i + 4, i + 8);
        let chunk_body = png_in.subarray(i + 8, i + 8 + chunk_len);
        let chunk_csum_raw = png_in.subarray(i + 8 + chunk_len, i + 8 + chunk_len + 4);
        // let chunk_csum = int_from_bytes( chunk_csum_raw )
        if (["IHDR", "PLTE", "IDAT", "IEND"].indexOf(chunk_type.toString()) === -1) {
            !finalOptions.quiet && console.log("Warning: dropping non-essential or unknown chunk:", chunk_type.toString());
            i = (i + 8 + chunk_len + 4);
            continue;
        }
        if (chunk_type.toString() == "IHDR") {
            width = (0, bufferHelper_1.int_from_bytes)(chunk_body.subarray(0, 4));
            height = (0, bufferHelper_1.int_from_bytes)(chunk_body.subarray(4, 8));
            !finalOptions.quiet && console.log(`Image size: ${width} x ${height}px`);
        }
        if (chunk_type.toString() == "IDAT") {
            chunk_body.forEach(v => idat_body.push(v));
            i = (i + 8 + chunk_len + 4);
            continue;
        }
        if (chunk_type.toString() == "IEND") {
            let start_offset = png_out.length + 8 + idat_body.length;
            content_in.forEach(v => idat_body.push(v));
            if (idat_body.length > width * height) {
                throw new Error("ERROR: Input files too big for cover image resolution.");
            }
            const end_central_dir_offset = (0, bufferHelper_1.endCentralDirOffsetRindex)(idat_body);
            let comment_length = (idat_body.length - end_central_dir_offset) - 22 + 0x10;
            let cl_range = [end_central_dir_offset + 20, end_central_dir_offset + 20 + 2];
            const byteArr = (0, bufferHelper_1.len_to_bytes_little)(comment_length, 2);
            idat_body[cl_range[0]] = byteArr[0];
            idat_body[cl_range[0] + 1] = byteArr[1];
            // find the number of central directory entries
            let cdent_count = (0, bufferHelper_1.zipfileGetCounter)(content_in);
            // find the offset of the central directory entries, and fix it
            let cd_range = [end_central_dir_offset + 16, end_central_dir_offset + 16 + 4];
            let central_dir_start_offset = (0, bufferHelper_1.int_from_bytes_little)(node_buffer_1.Buffer.from([
                idat_body[cd_range[0]],
                idat_body[cd_range[0] + 1],
                idat_body[cd_range[0] + 2],
                idat_body[cd_range[0] + 3]
            ]));
            const byteArrRange = (0, bufferHelper_1.len_to_bytes_little)(central_dir_start_offset + start_offset, 4);
            idat_body[cd_range[0]] = byteArrRange[0];
            idat_body[cd_range[0] + 1] = byteArrRange[1];
            idat_body[cd_range[0] + 2] = byteArrRange[2];
            idat_body[cd_range[0] + 3] = byteArrRange[3];
            for (let i = 0; i < cdent_count; i++) {
                central_dir_start_offset = (0, bufferHelper_1.centralDirStartOffset)(idat_body, central_dir_start_offset);
                let off_range = [central_dir_start_offset + 42];
                let off = (0, bufferHelper_1.int_from_bytes_little)(node_buffer_1.Buffer.from([
                    idat_body[off_range[0]],
                    idat_body[off_range[0] + 1],
                    idat_body[off_range[0] + 2],
                    idat_body[off_range[0] + 3]
                ]));
                const byteArrOff = (0, bufferHelper_1.len_to_bytes_little)(off + start_offset, 4);
                idat_body[off_range[0]] = byteArrOff[0];
                idat_body[off_range[0] + 1] = byteArrOff[1];
                idat_body[off_range[0] + 2] = byteArrOff[2];
                idat_body[off_range[0] + 3] = byteArrOff[3];
                central_dir_start_offset += 1;
            }
            (0, bufferHelper_1.len_to_bytes)(idat_body.length).forEach(v => png_out.push(v));
            utf8Encode.encode("IDAT").forEach(v => png_out.push(v));
            idat_body.forEach(v => png_out.push(v));
            let buffTemp = node_buffer_1.Buffer.from([...utf8Encode.encode("IDAT"), ...idat_body]);
            // console.log("zlib.crc32", crc32.unsigned(buffTemp)); // Debug number, important
            (0, bufferHelper_1.len_to_bytes)(buffer_crc32_1.default.unsigned(buffTemp)).forEach(v => png_out.push(v)); // zlib.crc32
        }
        chunk_len_raw.forEach(v => png_out.push(v));
        chunk_type.forEach(v => png_out.push(v));
        chunk_body.forEach(v => png_out.push(v));
        chunk_csum_raw.forEach(v => png_out.push(v));
        if (chunk_type.toString() == "IEND") {
            break;
        }
        i = (i + 8 + chunk_len + 4);
    }
    return Uint8Array.from(png_out);
}
exports.pngAddHiddenContent = pngAddHiddenContent;
function zipDataInPng(originalPngPath, inputContentPath, outputPath, option) {
    if (originalPngPath === "" || inputContentPath === "" || outputPath === "") {
        throw new Error("ERROR: Invalid input path");
    }
    let finalOptions = Object.assign({ quiet: true }, option);
    (0, checkIsPng_1.checkIsPng)(originalPngPath); // Error if original file is not a png
    if (!(0, checkIsPng_1.checkIsZip)(inputContentPath)) {
        throw new Error("ERROR: Input hidden content only accept .zip currently.");
    }
    const png_in = fs_1.default.readFileSync(originalPngPath, { flag: 'r' });
    const content_in = fs_1.default.readFileSync(inputContentPath, { flag: 'r' });
    const png_out = pngAddHiddenContent(png_in, content_in, finalOptions);
    fs_1.default.writeFileSync(outputPath, png_out);
    !finalOptions.quiet && console.log(`Finish writing to: ${outputPath}`);
    return true;
}
exports.zipDataInPng = zipDataInPng;
//# sourceMappingURL=zipDataInPng.js.map