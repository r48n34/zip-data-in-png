# 📚 tweetable-polyglot-png JS

Pack up to 3MB of data into a tweetable PNG polyglot file but in Nodejs.  

Works in `Windows` and `MacOS` 


<p align="left">

<a href="https://www.npmjs.com/package/zip-data-in-png"> <img src="https://img.shields.io/npm/v/zip-data-in-png" /> </a>
<a href="https://github.com/r48n34/zip-data-in-png"><img src="https://img.shields.io/github/actions/workflow/status/r48n34/zip-data-in-png/test.yml" /></a>

</p>

Original Repo (Python): https://github.com/DavidBuchanan314/tweetable-polyglot-png


## 🔧 Install
```bash
yarn add zip-data-in-png
npm i zip-data-in-png
```

## 🔍 Features
1. Fully Sync  
2. In typescript development  
3. Works in node.js (Not support web currently)  
4. Use Node native packages  

## 😃 Normal Usage

`zipDataInPng()`

Hide a `hello.zip` into `deno.png`, and output the file named `final.png`

```ts
import path from "path";
import { zipDataInPng } from 'zip-data-in-png';

zipDataInPng (
    path.join(__dirname, "deno.png"),  // Original data
    path.join(__dirname, "hello.zip"), // .zip file to hide
    path.join(__dirname, "final.png") // Output file
)
```

> Notes:
1. See https://github.com/DavidBuchanan314/tweetable-polyglot-png?tab=readme-ov-file#cover-image-requirements for input requirements

---

`pngAddHiddenContent()`

Hide a `hi.zip` into `cat.png`, and return a `Uint8Array` png Buffer for save in `hidden.png`. 

```ts
import fs from "fs";
import { pngAddHiddenContent } from 'zip-data-in-png';

const png_in = fs.readFileSync("cat.png", {flag:'r'});
const content_in = fs.readFileSync("hi.zip", {flag:'r'});

const result: Uint8Array = pngAddHiddenContent (
    png_in,         // Original data
    content_in,     // .zip file to hide
    { quiet: true } // Optional Flag
)

fs.writeFileSync("hidden.png", result);
```

## 🔍 Samples
Hide a `data.zip` into `deno.png`, and output the file named `result.png`

```ts
import path from "path";
import { zipDataInPng } from 'zip-data-in-png';

zipDataInPng (
    path.join(__dirname, "deno.png"),   // Original data
    path.join(__dirname, "data.zip"),   // .zip file to hide
    path.join(__dirname, "result.png") // Output file
)
```

**Notices:**   
1. The input file MUST be a `.png` file.  
2. Hidden file MUST be a `.zip` file.  
3. If you see `ERROR: Input files too big for cover image resolution.`, means the input `.png` resolution is too high.

## 🔄 Params
```ts
export function zipDataInPng(
    originalPngPath: string,
    inputContentPath: string,
    outputPath: string,
    option?: zipDataInPngOptions
) : boolean

export function pngAddHiddenContent(
    png_in: Buffer,     // Png file Buffer
    content_in: Buffer, // Zip file Buffer
    option?: zipDataInPngOptions
): Uint8Array

interface zipDataInPngOptions {
    quiet: boolean // Default: false, if true then will console.log all info
}
```

## 🚀 Advance usage
```ts
import path from "path";
import { zipDataInPng } from 'zip-data-in-png';

zipDataInPng (
    path.join(__dirname, "deno.png"),   
    path.join(__dirname, "data.zip"),   
    path.join(__dirname, "result.png"), 
    { quiet: false }
)
```


## 🪵 Logs

### 1.2.0
1. Better code structure.
2. Confrim to support Windows / MacOS

### 1.1.0
1. Adding function `pngAddHiddenContent()` for advance usage.

## 🔖 License
MIT