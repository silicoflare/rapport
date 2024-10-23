import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "crypto";

export default class AES {
  private key: Buffer;

  constructor(key: string) {
    this.key = createHash("sha256").update(key).digest();
  }

  encrypt(message: string) {
    const iv = randomBytes(12);

    const cipher = createCipheriv("aes-256-gcm", this.key, iv);
    const encrypted = cipher.update(Buffer.from(message)).toString("base64");
    return `${iv.toString("base64")}.${encrypted}`;
  }

  decrypt(message: string) {
    const [iv, msg] = message.split(".");

    const cipher = createDecipheriv(
      "aes-256-gcm",
      this.key,
      Buffer.from(iv, "base64"),
    );
    const decrypted = cipher
      .update(Buffer.from(msg, "base64"))
      .toString("utf8");
    return decrypted;
  }
}
