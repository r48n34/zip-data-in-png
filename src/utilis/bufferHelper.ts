// https://stackoverflow.com/questions/54257476/is-there-any-function-in-js-like-this-int-from-bytes-in-python
export function int_from_bytes(bufferArray: Buffer){
    console.log(bufferArray);
    
    return bufferArray.readUInt32BE(0)
}