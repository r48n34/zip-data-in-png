import path from "path";
import fs from "fs";
// import FileType from 'file-type';

import { checkIsPng } from "./utilis/checkIsPng";
import { int_from_bytes } from "./utilis/bufferHelper";

let utf8Encode = new TextEncoder();

const png_in_path = path.join(__dirname, "..", "test-data", "460989.png")
checkIsPng(png_in_path);

const png_in = fs.readFileSync(png_in_path, {flag:'r'});
console.log(png_in);

// const content_in = path.join(__dirname, "..", "test-data", "hello.zip")

let png_out: number[] = [] // Uint8Array at final
utf8Encode.encode("\x89PNG\r\n\x1a\n").forEach( v => png_out.push(v) )

let i = 8;
while(true){
    let chunk_len = int_from_bytes( png_in.subarray(i, i + 4) )
    let chunk_type = png_in.subarray(i + 4, i + 8)

    let chunk_body = png_in.subarray(i + 8, i + 8 + chunk_len)
    let chunk_csum = int_from_bytes( 
        png_in.subarray(i + 8 + chunk_len, i + 8 + chunk_len + 4)
    )

    console.log("chunk_len:", chunk_len)
	console.log("chunk_type:", chunk_type.toString())
	console.log("chunk_body:", chunk_body)
    console.log("chunk_csum:", chunk_csum)

    break;
}

fs.writeFileSync("hello.png", Uint8Array.from(png_out));