/// <reference types="node" />
export declare function zipfileGetCounter(zipFile: string): number;
export declare function int_from_bytes(bufferArray: Buffer): number;
export declare function int_from_bytes_little(bufferArray: Buffer | number[]): number;
export declare function len_to_bytes(num: number): number[];
export declare function len_to_bytes_little(num: number, bytesCount?: number): number[];
export declare function endCentralDirOffsetRindex(data: number[]): number;
export declare function centralDirStartOffset(data: number[], offset: number): number;
