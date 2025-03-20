import fs from "fs";
import crc32 from "buffer-crc32"
import { Buffer } from 'node:buffer';

import { checkIsPng, checkIsZip } from "./checkIsPng";
import { 
    centralDirStartOffset,
    endCentralDirOffsetRindex,
    int_from_bytes,
    int_from_bytes_little,
    len_to_bytes,
    len_to_bytes_little,
    zipfileGetCounter,
} from "./bufferHelper";

interface zipDataInPngOptions {
    quiet: boolean
}

// Input the png buffer, and hide a zip file in the png raw data
export function pngAddHiddenContent(
    png_in: Buffer, // Png file
    content_in: Buffer, // Zip file
    option?: zipDataInPngOptions
): Uint8Array {

    let finalOptions = {
        quiet: true,
        ...option
    }

    let utf8Encode = new TextEncoder();
    
    // Uint8Array at final, png header at init
    let png_out: number[] = [137, 80, 78, 71, 13, 10, 26, 10] 
   
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
    
        if(["IHDR", "PLTE", "IDAT", "IEND"].indexOf(chunk_type.toString()) === -1){
            !finalOptions.quiet && console.log("Warning: dropping non-essential or unknown chunk:", chunk_type.toString());
            
            i = (i + 8 + chunk_len + 4);
            continue
        }
    
        if (chunk_type.toString() == "IHDR"){   
            width = int_from_bytes(chunk_body.subarray(0, 4));
            height = int_from_bytes(chunk_body.subarray(4, 8));
    
            !finalOptions.quiet && console.log(`Image size: ${width} x ${height}px`)
        }
    
        if (chunk_type.toString() == "IDAT"){  
            chunk_body.forEach( v => idat_body.push(v) )
    
            i = (i + 8 + chunk_len + 4);
            continue
        }
    
        if (chunk_type.toString() == "IEND"){
            let start_offset = png_out.length + 8 + idat_body.length;
    
            content_in.forEach( v => idat_body.push(v))
    
            if(idat_body.length > width * height){
                throw new Error("ERROR: Input files too big for cover image resolution.")
            }
    
            const end_central_dir_offset = endCentralDirOffsetRindex(idat_body);
            
            let comment_length = (idat_body.length - end_central_dir_offset) - 22 + 0x10;
            let cl_range = [end_central_dir_offset + 20, end_central_dir_offset + 20 + 2]

            const byteArr = len_to_bytes_little(comment_length, 2);
            idat_body[cl_range[0]] = byteArr[0]
            idat_body[cl_range[0] + 1] = byteArr[1]
            
            // find the number of central directory entries
            let cdent_count = zipfileGetCounter(content_in) 
            
            // find the offset of the central directory entries, and fix it
            let cd_range = [end_central_dir_offset + 16, end_central_dir_offset + 16 + 4]
            
            let central_dir_start_offset = int_from_bytes_little(
                Buffer.from([
                    idat_body[cd_range[0]    ],
                    idat_body[cd_range[0] + 1],
                    idat_body[cd_range[0] + 2],
                    idat_body[cd_range[0] + 3]
                ])
            )

            const byteArrRange = len_to_bytes_little(
                central_dir_start_offset + start_offset,
                4
            );

            idat_body[cd_range[0]]     = byteArrRange[0]
            idat_body[cd_range[0] + 1] = byteArrRange[1]
            idat_body[cd_range[0] + 2] = byteArrRange[2]
            idat_body[cd_range[0] + 3] = byteArrRange[3]

            for(let i = 0; i < cdent_count; i ++){
                central_dir_start_offset = centralDirStartOffset(idat_body, central_dir_start_offset);

                let off_range = [central_dir_start_offset + 42]

                let off = int_from_bytes_little(
                    Buffer.from([
                        idat_body[off_range[0]    ],
                        idat_body[off_range[0] + 1],
                        idat_body[off_range[0] + 2],
                        idat_body[off_range[0] + 3]
                    ])
                )

                const byteArrOff = len_to_bytes_little(
                    off + start_offset,
                    4
                );
                
                idat_body[off_range[0]    ] = byteArrOff[0]
                idat_body[off_range[0] + 1] = byteArrOff[1]
                idat_body[off_range[0] + 2] = byteArrOff[2]
                idat_body[off_range[0] + 3] = byteArrOff[3]

                central_dir_start_offset += 1
            }
                
            len_to_bytes(idat_body.length).forEach( v => png_out.push(v)) 
            utf8Encode.encode("IDAT").forEach( v => png_out.push(v) ) 
            idat_body.forEach( v => png_out.push(v) ) 
    
            let buffTemp = Buffer.from([...utf8Encode.encode("IDAT"), ...idat_body])
            // console.log("zlib.crc32", crc32.unsigned(buffTemp)); // Debug number, important
    
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
    }

    return Uint8Array.from(png_out)
}

export function zipDataInPng(
    originalPngPath: string,
    inputContentPath: string,
    outputPath: string,
    option?: zipDataInPngOptions
): boolean{
    if(originalPngPath === "" || inputContentPath === "" || outputPath === ""){
        throw new Error("ERROR: Invalid input path")
    }

    let finalOptions = {
        quiet: true,
        ...option
    }

    checkIsPng(originalPngPath); // Error if original file is not a png

    if(!checkIsZip(inputContentPath)){
        throw new Error("ERROR: Input hidden content only accept .zip currently.")
    }

    const png_in = fs.readFileSync(originalPngPath, {flag:'r'});
    const content_in = fs.readFileSync(inputContentPath, {flag:'r'});

    const png_out = pngAddHiddenContent(png_in, content_in, finalOptions)
    fs.writeFileSync(outputPath, png_out);

    !finalOptions.quiet && console.log(`Finish writing to: ${outputPath}`);
    return true
}
