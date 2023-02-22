"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsZip = exports.checkIsPng = void 0;
const magic_bytes_js_1 = __importDefault(require("magic-bytes.js"));
const fs_1 = __importDefault(require("fs"));
function checkIsPng(filePath) {
    const type = (0, magic_bytes_js_1.default)(fs_1.default.readFileSync(filePath)).map(v => v.typename);
    if (type.length === 0 || type.indexOf("png") === -1) {
        throw new Error("ASSERT ERROR: Input tagret file is not a .png file.");
    }
    return true;
}
exports.checkIsPng = checkIsPng;
function checkIsZip(filePath) {
    const type = (0, magic_bytes_js_1.default)(fs_1.default.readFileSync(filePath)).map(v => v.typename);
    if (type.length === 0) {
        return false;
    }
    if (type.indexOf("zip") >= 0 || type.indexOf("jar") >= 0) {
        return true;
    }
    return false;
}
exports.checkIsZip = checkIsZip;
//# sourceMappingURL=checkIsPng.js.map