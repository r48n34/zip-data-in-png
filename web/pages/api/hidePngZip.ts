import { formService } from '@/services/formService';
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs";
import FileType from "file-type"
import { pngAddHiddenContent } from 'zip-data-in-png';
import AdmZip from "adm-zip"

export const config = {
    api: {
        bodyParser: false
	}
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        const [_, files] = await formService.parseRequest(req);

        if(!files.file || !files.hidden){
            throw new Error("Missing files")
        }

        
        const png_in_path     = (files.file as any).filepath
        const content_in_path = (files.hidden as any).filepath

        const png_in_path_type = await FileType.fromFile(png_in_path)
        const content_in_type = await FileType.fromFile(content_in_path)

        if(png_in_path_type?.ext !== "png" || content_in_type?.ext !== "zip"){
            throw new Error("Invalid file type")
        }
        
        const png_in     = fs.readFileSync(png_in_path, {flag:'r'});
        const content_in = fs.readFileSync(content_in_path, {flag:'r'});
    
        const result: Uint8Array = pngAddHiddenContent (
            png_in,         // Original data
            content_in,     // .zip file to hide
            { quiet: true } // Output file
        )

        const zip = new AdmZip(Buffer.from(result));
        zip.getEntries();
    
        res.setHeader("content-type", 'image/png');
        return res.status(200).send(Buffer.from(result));
    } 
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }

}
