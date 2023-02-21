import path from "path";
import fs from "fs";
import filetype from 'magic-bytes.js'

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
    fs.unlinkSync(path.join(__dirname, "..", "test-data", "jestTest.zip"));

})