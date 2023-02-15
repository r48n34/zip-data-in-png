export function int_from_bytes(bufferArray: any){
    const buf = Buffer.from(bufferArray) // 0x12345678 = 305419896

    console.log(buf.readUInt32BE(0)) // 305419896
    return buf.readUInt32BE(0)
}