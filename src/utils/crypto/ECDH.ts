import {
  createCipheriv,
  createDecipheriv,
  createECDH,
  createHash,
  createHmac,
  randomBytes,
  type BinaryToTextEncoding,
  type ECDH as EC,
} from "crypto";
import { readFileSync, writeFileSync } from "fs";
import { splitBuffer } from "../tools";

export default class ECDH {
  private ecdh: EC | null = null;
  private static separator = Buffer.from([
    0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
    0xff, 0xff, 0xff, 0xff,
  ]);

  constructor() {
    this.ecdh = createECDH("secp521r1");
    this.ecdh.generateKeys();
  }

  getPublic(): Buffer;
  getPublic(enc: BinaryToTextEncoding): string;
  getPublic(enc?: BinaryToTextEncoding): Buffer | string {
    return enc ? this.ecdh!.getPublicKey(enc) : this.ecdh!.getPublicKey();
  }

  getPrivate(): Buffer;
  getPrivate(enc: BinaryToTextEncoding): string;
  getPrivate(enc?: BinaryToTextEncoding): Buffer | string {
    return enc ? this.ecdh!.getPrivateKey(enc) : this.ecdh!.getPrivateKey();
  }

  setPrivate(key: Buffer) {
    this.ecdh!.setPrivateKey(key);
  }

  compute(pubkey: Buffer) {
    return this.ecdh!.computeSecret(pubkey);
  }

  encrypt(message: string, pubKey: Buffer) {
    const ephECDH = new ECDH();
    const key = createHash("sha256").update(ephECDH.compute(pubKey)).digest();
    const iv = randomBytes(12);

    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const encrypted = cipher.update(Buffer.from(message)).toString("base64");
    return `${iv.toString("base64")}.${ephECDH.getPublic().toString("base64")}.${encrypted}`;
  }

  decrypt(message: string) {
    const [iv, pubKey, msg] = message.split(".");
    const key = createHash("sha256")
      .update(this.compute(Buffer.from(pubKey, "base64")))
      .digest();

    const cipher = createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(iv, "base64"),
    );
    const decrypted = cipher
      .update(Buffer.from(msg, "base64"))
      .toString("utf8");
    return decrypted;
  }

  encrypt_file(path: string, pubKey: Buffer) {
    const ephECDH = new ECDH();
    const key = createHash("sha256").update(ephECDH.compute(pubKey)).digest();
    const iv = randomBytes(16);

    const cipher = createCipheriv("aes-256-cbc", key, iv);
    const fileContent = readFileSync(path);
    const encrypted = Buffer.concat([
      cipher.update(fileContent),
      cipher.final(),
    ]);

    const hmac = createHmac("sha256", key).update(fileContent).digest();

    const buf = Buffer.concat([
      iv,
      ECDH.separator,
      ephECDH.getPublic(),
      ECDH.separator,
      encrypted,
      ECDH.separator,
      hmac,
    ]);

    writeFileSync(`${path}.enc`, buf);
  }

  decrypt_file(path: string) {
    let file = readFileSync(path);

    const [iv, pubKey, encrypted, hmac] = splitBuffer(file, ECDH.separator);

    const key = createHash("sha256").update(this.compute(pubKey)).digest();

    const decipher = createDecipheriv("aes-256-cbc", key, iv);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    const decHmac = createHmac("sha256", key).update(decrypted).digest();

    if (hmac.toString("base64") !== decHmac.toString("base64")) {
      throw new Error("File corrupted. HMAC mismatch.");
    }

    writeFileSync(path.replace(".enc", ""), decrypted);
  }
}
