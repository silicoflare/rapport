// file to perform RSA encryption with a 2048-bit key size

import { createPrivateKey, createPublicKey, generateKeyPairSync, privateDecrypt, privateEncrypt, publicDecrypt, publicEncrypt } from "crypto";

export function generate() {
  const {
    publicKey,
    privateKey,
  } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  return [publicKey, privateKey]
}


export function encrypt(data: string, key: string, isPrivate = false) {
  return (isPrivate ? privateEncrypt(key, Buffer.from(data)) : publicEncrypt(key, Buffer.from(data))).toString("base64")
}


export function decrypt(data: string, key: string, isPublic = false) {
  return (isPublic ? publicDecrypt(key, Buffer.from(data)) : privateDecrypt(key, Buffer.from(data))).toString("utf8")
}


export function getPublic(privateKey: string) {
  const priv = createPrivateKey({
    key: privateKey,
    format: "pem"
  })

  return createPublicKey(priv).export({
    type: "spki",
    format: "pem"
  })
}