# Rapport

Rapport is an end-to-end encrypted messaging app written in TypeScript. It uses a combination of AES-256 and ECDH to ensure perfect secrecy, **as long as the key is secret**.

![homepage](https://github.com/user-attachments/assets/15caa58a-2da5-4840-8f32-cda187a7c2dc)

![sign up screen](https://github.com/user-attachments/assets/296ce533-95d1-4146-80f5-4b84f5ab2fa4)

![login screen](https://github.com/user-attachments/assets/f79d3d74-8f38-42ef-8f10-f889e96c59af)

![chat list](https://github.com/user-attachments/assets/c4c74bd4-282b-4524-b054-5e79dbf89e88)

![message area](https://github.com/user-attachments/assets/bc7a13cb-0a21-4d7c-978b-c7b7ce34d7cc)

---

## Features

- Simple interface
- Password-protected account
- Recovery phrase to recover account
- Password is NEVER stored on the database, not even hashed
- Several layers of encryption for each message
- Basic markdown supported (headings, bold, italics, lists and blockquotes)

---

## How it works

It is hard to explain how it works, in a simple manner, so here's all the layers of decryption to get to a message:

### Authentication

$$
password \xrightarrow[\times97965,\ AUTH\_SALT]{pbkdf2-sha256} PAK\ {(password\ auth\ key)}
$$

$$
phrasestore\ \xrightarrow[PAK]{AES\ decrypt}\ passphrase'
$$

$$
passphrase'\ ==\ passphrase\ ?\ Verified
$$

### User secrets

$$
keystore\ \xrightarrow[PAK]{AES\ decrypt}\  user\_secret
$$

$$
privatestore\ \xrightarrow[user\_secret]{AES\ decrypt}\ private\_key
$$

### Chat secrets

$$
chatstore\ \xrightarrow[private\_key]{ECIES\ decrypt}\ chat\_secret
$$

$$
recipient\_public\_key\ \xrightarrow[private\_key]{ECDH\ compute}\ shared\_secret
$$

### Message decryption

$$
shared\_secret\ \xrightarrow{sha256}\ K_{-2}
$$

$$
msgstore\ \xrightarrow[K_{-2}]{AES\ decrypt}\ res_{-1}
$$

$$
msg_id\ +\ chat\_secret\ \xrightarrow[\times230903,\ MSG\_SALT]{pbkdf2-sha256}\ K_{-1}
$$

$$
res_{-1}\ \xrightarrow[K_{-1}]{AES\ decrypt}\ message
$$
