# Rapport

Rapport is an end-to-end encrypted messaging app written in TypeScript. It uses a combination of AES-256 and ECDH to ensure perfect secrecy, **as long as the key is secret**.

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
