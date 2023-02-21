import AdmZip from "adm-zip"

export function zipfileGetCounter(zipFile: string){
    const zip = new AdmZip(zipFile);
    const zipEntries = zip.getEntries(); // an array of ZipEntry records

    // console.log(zipEntries);
    return zipEntries.length
}

// https://stackoverflow.com/questions/54257476/is-there-any-function-in-js-like-this-int-from-bytes-in-python
export function int_from_bytes(bufferArray: Buffer): number{
    return bufferArray.readUInt32BE(0)
}

export function int_from_bytes_little(bufferArray: Buffer): number{
    let reverseArr = bufferArray.reverse();

    const buf = Buffer.from(reverseArr)
    return buf.readUInt32BE(0)
}

export function len_to_bytes(num: number){
    let b = new ArrayBuffer(4);
    new DataView(b).setUint32(0, num);

    const data = Array.from(new Uint8Array(b));

    return data
}

export function len_to_bytes_little(num: number, bytesCount: number = 4){
    return len_to_bytes(num).reverse().filter( (_, i) => i < bytesCount)
}

export function unpack_from_H(data:number[], offset: number){
    // console.log("INFO:", data.length, offset)
    
    let count = 0;

    let d:number[] = []

    for(let i = offset; i < data.length; i ++){
        d.push(data[i]);
    }
    // console.log(d)
    return count
}


export function endCentralDirOffsetRindex(data: number[]){
    
    for(let i = 0; i < data.length; i ++){
        if(
            data[i] === 80
            && data[i + 1] === 75
            && data[i + 2] === 5
            && data[i + 3] === 6
        ){
           
            return i
        }
    }

    return -1
}

export function centralDirStartOffset(data: number[], offset: number){
    for(let i = offset; i < data.length; i ++){
        if(
            data[i] === 80
            && data[i + 1] === 75
            && data[i + 2] === 1
            && data[i + 3] === 2
        ){
           
            return i
        }
    }

    return -1
}