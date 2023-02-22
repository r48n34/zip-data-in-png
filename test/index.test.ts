import path from "path";
import fs from "fs";
import filetype from 'magic-bytes.js'
import AdmZip from "adm-zip"

import { zipDataInPng } from '../dist/index';

test('zipDataInPng to works normal', () => {

    let finalFilePath = path.join(__dirname, "..", "test-data", "jestTest.png")

    expect(
        zipDataInPng (
            path.join(__dirname, "..", "test-data", "deno.png"),
            path.join(__dirname, "..", "test-data", "hello.zip"),
            finalFilePath,
        )
    ).toBe(true);

    fs.renameSync(
        finalFilePath,
        path.join(__dirname, "..", "test-data", "jestTest.zip")
    );

    const type = filetype(
        fs.readFileSync(path.join(__dirname, "..", "test-data", "jestTest.zip"))
    ).map( v => v.typename );

    expect(type.indexOf("zip") >= 0).toBe(false);

    const zip = new AdmZip(path.join(__dirname, "..", "test-data", "jestTest.zip"));
    const zipEntries = zip.getEntries(); 
    const fileNameArray = zipEntries.map( v => v.name );

    expect(fileNameArray.length).toBe(2);
    expect(fileNameArray).toEqual(["book.pdf", "hello.txt"]);

    fs.unlinkSync(path.join(__dirname, "..", "test-data", "jestTest.zip"));

})

test('zipDataInPng to error in invalid path ', () => {
    expect(() => {
        zipDataInPng (
            path.join(__dirname, "..", "test-data", "deno.png"),
            path.join(__dirname, "..", "test-data", "hello.zip"),
            "",
        )
    }).toThrow("ERROR: Invalid input path")

    expect(() => {
        zipDataInPng (
            path.join(__dirname, "..", "test-data", "deno.png"),
            "",
            path.join(__dirname, "..", "test-data", "helloResult.zip"),
        )
    }).toThrow("ERROR: Invalid input path")

    expect(() => {
        zipDataInPng (
            "",
            path.join(__dirname, "..", "test-data", "hello.zip"),
            path.join(__dirname, "..", "test-data", "helloResult.png"),
        )
    }).toThrow("ERROR: Invalid input path")
})

test('zipDataInPng to error in not a png input ', () => {
    
    expect(() => {
        zipDataInPng (
            path.join(__dirname, "..", "test-data", "book.pdf"),
            path.join(__dirname, "..", "test-data", "hello.zip"),
            path.join(__dirname, "..", "test-data", "helloResult.png"),
        )
    }).toThrow("ASSERT ERROR: Input tagret file is not a .png file.")

})

test('zipDataInPng to error in hidden content is not a .zip ', () => {

    expect(() => {
        zipDataInPng (
            path.join(__dirname, "..", "test-data", "deno.png"),
            path.join(__dirname, "..", "test-data", "book.pdf"),
            path.join(__dirname, "..", "test-data", "helloResult.png"),
        )
    }).toThrow("ERROR: Input hidden content only accept .zip currently.")

})