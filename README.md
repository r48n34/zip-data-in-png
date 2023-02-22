# tweetable-polyglot-png in js

Original Repo: https://github.com/DavidBuchanan314/tweetable-polyglot-png

Pack up to 3MB of data into a tweetable PNG polyglot file but in nodejs.

## Status 
Currently in beta, please do not use it in productions.


## Features
1. Fully Sync
2. In typescript
3. Works in node.js (Not support web currently)

## Why not in python
IDK

## Usage

```js
import path from "path";
import { zipDataInPng } from 'zip-data-in-png';

zipDataInPng (
    path.join(__dirname, "deno.png"),  // Original data
    path.join(__dirname, "hello.zip"), // .zip file to hide
    path.join(__dirname, "final.png"), // Output file
)
```