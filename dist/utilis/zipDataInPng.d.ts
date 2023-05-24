/// <reference types="node" />
import { Buffer } from 'node:buffer';
interface zipDataInPngOptions {
    quiet: boolean;
}
export declare function pngAddHiddenContent(png_in: Buffer, // Png file
content_in: Buffer, // Zip file
option?: zipDataInPngOptions): Uint8Array;
export declare function zipDataInPng(originalPngPath: string, inputContentPath: string, outputPath: string, option?: zipDataInPngOptions): boolean;
export {};
