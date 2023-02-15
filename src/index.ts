import path from "path";
import fs from "fs";
// import FileType from 'file-type';

import { checkIsPng } from "./utilis/checkIsPng";
import { int_from_bytes } from "./utilis/bufferHelper";

let utf8Encode = new TextEncoder();

const png_in_path = path.join(__dirname, "..", "test-data", "460989.png")
checkIsPng(png_in_path);

const png_in = fs.readFileSync(png_in_path, {flag:'r'});


// const content_in = path.join(__dirname, "..", "test-data", "hello.zip")

let png_out: number[] = [] // Uint8Array at final
utf8Encode.encode("\x89PNG\r\n\x1a\n").forEach( v => png_out.push(v) )

let idat_body: number[] = [];

let i = 8;
while(true){
    let chunk_len_raw = png_in.subarray(i, i + 4) 
    let chunk_len = int_from_bytes( chunk_len_raw )

    let chunk_type = png_in.subarray(i + 4, i + 8)

    let chunk_body = png_in.subarray(i + 8, i + 8 + chunk_len)

    let chunk_csum_raw = png_in.subarray(i + 8 + chunk_len, i + 8 + chunk_len + 4)
    let chunk_csum = int_from_bytes( chunk_csum_raw )

    console.log("chunk_len:", chunk_len)
	console.log("chunk_type:", chunk_type.toString())
	console.log("chunk_body:", chunk_body)
    console.log("chunk_csum:", chunk_csum)

    if(["IHDR", "PLTE", "IDAT", "IEND"].indexOf(chunk_type.toString()) === -1){
        console.log("Warning: dropping non-essential or unknown chunk:", chunk_type.toString());
        
        i = (i + 8 + chunk_len + 4);
        console.log("-----------------");
		continue
    }

    if (chunk_type.toString() == "IHDR"){   
        let width = int_from_bytes(chunk_body.subarray(0, 4));
        let height = int_from_bytes(chunk_body.subarray(4, 8));

		console.log(`Image size: ${width}x${height}px`)
    }

    if (chunk_type.toString() == "IDAT"){  
        chunk_body.forEach( v => idat_body.push(v) )

        i = (i + 8 + chunk_len + 4);
        console.log("-----------------");
		continue
    }

    if (chunk_type.toString() == "IEND"){
        let start_offset = (png_out.length - 1) + 8 + idat_body.length;
        
        console.log(`Embedded file starts at offset 0x${start_offset.toString(16)}`)
    }

    
    if (chunk_type.toString() == "IEND"){
        break
    }

    chunk_len_raw.forEach( v => png_out.push(v))
    chunk_type.forEach( v => png_out.push(v))
    chunk_body.forEach( v => png_out.push(v))
    chunk_csum_raw.forEach( v => png_out.push(v))
    
    i = (i + 8 + chunk_len + 4);
    
    console.log("-----------------");
    // break;
}

fs.writeFileSync("hello.png", Uint8Array.from(png_out));
