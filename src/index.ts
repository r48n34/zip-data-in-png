import path from "path";
import fs from "fs";
// import FileType from 'file-type';

import { checkIsPng } from "./utilis/checkIsPng";

let utf8Encode = new TextEncoder();

const png_in_path = path.join(__dirname, "..", "test-data", "460989.png")
checkIsPng(png_in_path);

const png_in = fs.readFileSync(png_in_path, {flag:'r'});
console.log(png_in);

// const content_in = path.join(__dirname, "..", "test-data", "hello.zip")

let png_out: number[] = [] // Uint8Array at final
utf8Encode.encode("\x89PNG\r\n\x1a\n").forEach( v => png_out.push(v) )


while(true){
    
    
    break;
}

fs.writeFileSync("hello.png", Uint8Array.from(png_out));