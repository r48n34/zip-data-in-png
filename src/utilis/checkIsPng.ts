import filetype from 'magic-bytes.js'
import fs from 'fs'

export function checkIsPng(filePath: string): boolean{
    const type = filetype(fs.readFileSync(filePath)).map( v => v.typename )

    if(type.length === 0 || type.indexOf("png") === -1){
        throw new Error("Assert Error: Tagret file is not a .png file.")
    }
    
    return true
}

export function checkIsZip(filePath: string): boolean{
    const type = filetype(fs.readFileSync(filePath)).map( v => v.typename )

    if(type.length === 0){
        return false
    }

    if(type.indexOf("zip") >= 0 || type.indexOf("jar") >= 0){
        return true
    }
    
    return false
}