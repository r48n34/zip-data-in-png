import path from "path";
import { zipDataInPng } from '../dist/index';

test('zipDataInPng to works normal', () => {
  expect(
    zipDataInPng (
        path.join(__dirname, "..", "test-data", "deno.png"),
        path.join(__dirname, "..", "test-data", "hello.zip"),
        path.join(__dirname, "..", "test-data", "helloResultJs.png"),
    )
  ).toBe(true);
})