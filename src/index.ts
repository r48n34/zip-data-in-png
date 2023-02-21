import path from "path";
import { zipDataInPng } from "./utilis/zipDataInPng";

( async () => {
    zipDataInPng(
        path.join(__dirname, "..", "test-data", "deno.png"),
        path.join(__dirname, "..", "test-data", "hello.zip"),
        path.join(__dirname, "..", "test-data", "helloResultJs.png"),
    )
})()

export { zipDataInPng }