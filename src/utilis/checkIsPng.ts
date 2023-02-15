import filetype from 'magic-bytes.js'
import fs from 'fs'

export function checkIsPng(filePath: string): boolean{
    const type = filetype(fs.readFileSync(filePath)).map( v => v.typename )
    console.log(type);

    if(type.length === 0 || type.indexOf("png") === -1){
        throw new Error("Assert Error: Tagret file is not a .png file.")
    }
    
    return true
}