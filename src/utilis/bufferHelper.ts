// https://stackoverflow.com/questions/54257476/is-there-any-function-in-js-like-this-int-from-bytes-in-python
export function int_from_bytes(bufferArray: any){
    const buf = Buffer.from(bufferArray) // 0x12345678 = 305419896
    return buf.readUInt32BE(0)
}