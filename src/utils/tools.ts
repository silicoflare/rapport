import { generate } from "random-words";

export function generatePhrase() {
  return (generate({ exactly: 12, minLength: 5, maxLength: 7 }) as string[]).join(" ").toLowerCase()
}

export function splitBuffer(buffer: Buffer, delimiter: Buffer): Buffer[] {
  const result: Buffer[] = [];
  let start = 0;
  let index: number;

  while ((index = buffer.indexOf(delimiter, start)) !== -1) {
    result.push(buffer.subarray(start, index));
    start = index + delimiter.length;
  }

  result.push(buffer.subarray(start));
  return result;
}
