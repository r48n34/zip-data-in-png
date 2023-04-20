# tweetable-polyglot-png in js

Pack up to 3MB of data into a tweetable PNG polyglot file but in nodejs.


<p align="left">

<a href="https://www.npmjs.com/package/zip-data-in-png"> <img src="https://img.shields.io/npm/v/zip-data-in-png" /> </a>
<a href="https://github.com/r48n34/zip-data-in-png"><img src="https://img.shields.io/github/actions/workflow/status/r48n34/zip-data-in-png/test.yml" /></a>

</p>

Original Repo: https://github.com/DavidBuchanan314/tweetable-polyglot-png


## Install
```bash
yarn add zip-data-in-png
npm i zip-data-in-png
```

## Status 
Currently in beta, please do not use it in productions.


## Features
1. Fully Sync
2. In typescript development
3. Works in node.js (Not support web currently)

## Why not in python but nodejs
I Don't know.

## Usage

```ts
import path from "path";
import { zipDataInPng } from 'zip-data-in-png';

zipDataInPng (
    path.join(__dirname, "deno.png"),  // Original data
    path.join(__dirname, "hello.zip"), // .zip file to hide
    path.join(__dirname, "final.png") // Output file
)
```

## Sample
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

## Params
```ts
export function zipDataInPng(
    originalPngPath: string,
    inputContentPath: string,
    outputPath: string,
    option?: zipDataInPngOptions
)

interface zipDataInPngOptions {
    quiet: boolean // Default: false, if true then will console.log all info
}
```

## Advance usage
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
