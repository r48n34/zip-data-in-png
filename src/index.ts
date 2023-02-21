import path from "path";
import fs from "fs";
import crc32 from "buffer-crc32"
// import FileType from 'file-type';

import { checkIsPng, checkIsZip } from "./utilis/checkIsPng";
import { 
    centralDirStartOffset,
    endCentralDirOffsetRindex,
    int_from_bytes,
    int_from_bytes_little,
    len_to_bytes,
    len_to_bytes_little,
    zipfileGetCounter,
} from "./utilis/bufferHelper";

export async function zipDataInPng(originalPngPath: string, inputContentPath: string, outputPath: string){

    let utf8Encode = new TextEncoder();
    checkIsPng(originalPngPath);
    
    const png_in = fs.readFileSync(originalPngPath, {flag:'r'});
    const content_in = fs.readFileSync(inputContentPath, {flag:'r'});
    
    let png_out: number[] = [137, 80, 78, 71, 13, 10, 26, 10] // Uint8Array at final
   
    let idat_body: number[] = [];
    let width = 0;
    let height = 0;
    
    let i = 8;
    while(true){
        let chunk_len_raw = png_in.subarray(i, i + 4) 
        let chunk_len = int_from_bytes( chunk_len_raw ) // int.from_bytes
    
        let chunk_type = png_in.subarray(i + 4, i + 8)
    
        let chunk_body = png_in.subarray(i + 8, i + 8 + chunk_len)
    
        let chunk_csum_raw = png_in.subarray(i + 8 + chunk_len, i + 8 + chunk_len + 4)
        let chunk_csum = int_from_bytes( chunk_csum_raw )
    
        console.log("chunk_len:", chunk_len)
        console.log("chunk_type:", chunk_type.toString())
        // console.log("chunk_body:", chunk_body)
        console.log("chunk_csum:", chunk_csum)
    
        if(["IHDR", "PLTE", "IDAT", "IEND"].indexOf(chunk_type.toString()) === -1){
            console.log("Warning: dropping non-essential or unknown chunk:", chunk_type.toString());
            
            i = (i + 8 + chunk_len + 4);
            console.log("-----------------");
            continue
        }
    
        if (chunk_type.toString() == "IHDR"){   
            width = int_from_bytes(chunk_body.subarray(0, 4));
            height = int_from_bytes(chunk_body.subarray(4, 8));
    
            console.log(`Image size: ${width}x${height}px`)
        }
    
        if (chunk_type.toString() == "IDAT"){  
            chunk_body.forEach( v => idat_body.push(v) )
    
            i = (i + 8 + chunk_len + 4);
            console.log("-----------------");
            continue
        }
    
        if (chunk_type.toString() == "IEND"){
            let start_offset = png_out.length + 8 + idat_body.length;
    
            console.log("png_out.tell()", png_out.length)
            console.log("len(idat_body)", idat_body.length)
            
            console.log(`Embedded file starts at offset 0x${start_offset.toString(16)}`);
    
            content_in.forEach( v => idat_body.push(v))
    
            if(idat_body.length > width * height){
                throw new Error("ERROR: Input files too big for cover image resolution.")
            }
    
            if(checkIsZip(inputContentPath)){
                console.log("Fixing up zip offsets...")
                
                const end_central_dir_offset = endCentralDirOffsetRindex(idat_body);
                console.log("end_central_dir_offset", end_central_dir_offset);
                
                let comment_length = (idat_body.length - end_central_dir_offset) - 22 + 0x10;
                console.log("comment_length", comment_length);
                
                let cl_range = [end_central_dir_offset + 20, end_central_dir_offset + 20 + 2]
                console.log("cl_range", cl_range);
                
                
                console.log("data[cl_range]", idat_body[cl_range[0]], idat_body[cl_range[1]])
                console.log("data length", idat_body.length)
                
                const byteArr = len_to_bytes_little(comment_length, 2);
                idat_body[cl_range[0]] = byteArr[0]
                idat_body[cl_range[0] + 1] = byteArr[1]
                
                console.log("data[cl_range] After 1", idat_body[62660])
                console.log("data[cl_range] After 2", idat_body[62661])

                console.log("After LENGTH:", idat_body.length)
                
                // console.log("data[cl_range] After", idat_body[cl_range[0]], idat_body[cl_range[1]])

                // find the number of central directory entries
                let cdent_count = zipfileGetCounter(inputContentPath) 
                console.log("cdent_count", cdent_count)

                // find the offset of the central directory entries, and fix it
                let cd_range = [end_central_dir_offset + 16, end_central_dir_offset + 16 + 4]
                console.log("cd_range", cd_range);

                console.log(
                    "cd_range",
                    idat_body[cd_range[0]],
                    idat_body[cd_range[0] + 1],
                    idat_body[cd_range[0] + 2],
                    idat_body[cd_range[0] + 3],
                );
                
                let central_dir_start_offset = int_from_bytes_little(
                    Buffer.from([
                        idat_body[cd_range[0]    ],
                        idat_body[cd_range[0] + 1],
                        idat_body[cd_range[0] + 2],
                        idat_body[cd_range[0] + 3]
                    ])
                )
                console.log("central_dir_start_offset", central_dir_start_offset);
                
                const byteArrRange = len_to_bytes_little(
                    central_dir_start_offset + start_offset,
                    4
                );

                idat_body[cd_range[0]] = byteArrRange[0]
                idat_body[cd_range[0] + 1] = byteArrRange[1]
                idat_body[cd_range[0] + 2] = byteArrRange[2]
                idat_body[cd_range[0] + 3] = byteArrRange[3]
                console.log("byteArrRange", byteArrRange);

                console.log("byteArrRange", idat_body[62656])

                for(let i = 0; i < cdent_count; i ++){
                    central_dir_start_offset = centralDirStartOffset(idat_body, central_dir_start_offset);

                    console.log("LOOP central_dir_start_offset", central_dir_start_offset)
                    let off_range = [central_dir_start_offset + 42]

                    let off = int_from_bytes_little(
                        Buffer.from([
                            idat_body[off_range[0]    ],
                            idat_body[off_range[0] + 1],
                            idat_body[off_range[0] + 2],
                            idat_body[off_range[0] + 3]
                        ])
                    )

                    console.log("OFF", off);

                    const byteArrOff = len_to_bytes_little(
                        off + start_offset,
                        4
                    );

                    console.log("byteArrOff", byteArrOff);
                    


                    idat_body[off_range[0]] = byteArrOff[0]
                    idat_body[off_range[0] + 1] = byteArrOff[1]
                    idat_body[off_range[0] + 2] = byteArrOff[2]
                    idat_body[off_range[0] + 3] = byteArrOff[3]

                    central_dir_start_offset += 1
                }
                
            }
    
            len_to_bytes(idat_body.length).forEach( v => png_out.push(v)) // png_out.write(len(idat_body).to_bytes(4, "big"))
            utf8Encode.encode("IDAT").forEach( v => png_out.push(v) ) // png_out.write(b"IDAT")
            idat_body.forEach( v => png_out.push(v) ) // png_out.write(idat_body)
    
            let buffTemp = Buffer.from([...utf8Encode.encode("IDAT"), ...idat_body])
            console.log("zlib.crc32", crc32.unsigned(buffTemp));
    
            len_to_bytes(crc32.unsigned(buffTemp)).forEach( v => png_out.push(v) ) // zlib.crc32
        }
    
        
        chunk_len_raw.forEach( v => png_out.push(v))
        chunk_type.forEach( v => png_out.push(v))
        chunk_body.forEach( v => png_out.push(v))
        chunk_csum_raw.forEach( v => png_out.push(v))
        
        if (chunk_type.toString() == "IEND"){
            break
        }

        i = (i + 8 + chunk_len + 4);
        console.log("-----------------");
    }
    
    fs.writeFileSync(outputPath, Uint8Array.from(png_out));
}

( async () => {
    await zipDataInPng(
        path.join(__dirname, "..", "test-data", "deno.png"),
        path.join(__dirname, "..", "test-data", "hello.zip"),
        path.join(__dirname, "..", "test-data", "helloResultJs.png"),
    )
})()