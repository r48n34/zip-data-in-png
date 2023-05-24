// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";
import multer from "npm:multer";
import { pngAddHiddenContent } from "npm:zip-data-in-png@1.1.1";
import { Buffer } from 'node:buffer';

const app = express();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.get("/", (req, res) => {
    res.send("Welcome to the Dinosaur API!");
});

const cpUpload = upload.fields([{ name: 'file', maxCount: 1 }, { name: 'hidden', maxCount: 1 }])
app.post('/upload', cpUpload, function (req, res, next) {

    const fileList = req.files as any

    if(!fileList.file || !Array.isArray(fileList.file) || fileList.file.length <= 0){
        res.json({ status: false, message: "Missing file"})
    }

    if(!fileList.hidden || !Array.isArray(fileList.hidden) || fileList.hidden.length <= 0){
        res.json({ status: false, message: "Missing hidden"})
    }

    const pngIn = fileList.file[0].buffer
    const contentIn = fileList.hidden[0].buffer

    const result: Uint8Array = pngAddHiddenContent(
        Buffer.from(pngIn),       
        Buffer.from(contentIn),     
        { quiet: true }
    )

    res.set('content-type', 'image/png')
    res.send(Buffer.from(result))
})


const PORT = 8081
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT} ...`);
});