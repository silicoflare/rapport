import { generate } from "random-words";

export function generatePhrase() {
  return (generate({ exactly: 12, minLength: 5, maxLength: 7 }) as string[]).join(" ").toLowerCase()
}