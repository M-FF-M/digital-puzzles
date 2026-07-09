// crypto-puzzle.js
//
// Browser-only encryption/decryption helper using Web Crypto.
// No external libraries required.
//
// Provides:
//   PuzzleCrypto.encryptString(key, plaintext)
//   PuzzleCrypto.decryptString(key, ciphertext)
//
//   PuzzleCrypto.encryptBytes(key, Uint8ArrayOrArrayBuffer, metadata)
//   PuzzleCrypto.decryptBytes(key, Uint8ArrayOrArrayBuffer)

const PuzzleCrypto = (() => {
  const VERSION = 1;
  const STRING_PREFIX = "puzzlecrypt:";
  const FILE_MAGIC_TEXT = "PuzzleCryptoFileV1\n";
  const ITERATIONS = 200_000;

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const FILE_MAGIC = encoder.encode(FILE_MAGIC_TEXT);

  function bytesToBase64(bytes) {
    let binary = "";
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }
    return btoa(binary);
  }

  function base64ToBytes(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function stringToBytes(str) {
    return encoder.encode(str);
  }

  function bytesToString(bytes) {
    return decoder.decode(bytes);
  }

  function normalizeBytes(input) {
    if (input instanceof Uint8Array) {
      return input;
    }

    if (input instanceof ArrayBuffer) {
      return new Uint8Array(input);
    }

    if (ArrayBuffer.isView(input)) {
      return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    }

    throw new TypeError("Expected Uint8Array, ArrayBuffer, or ArrayBuffer view");
  }

  function concatBytes(parts) {
    const totalLength = parts.reduce((sum, part) => sum + part.length, 0);
    const result = new Uint8Array(totalLength);

    let offset = 0;
    for (const part of parts) {
      result.set(part, offset);
      offset += part.length;
    }

    return result;
  }

  function uint32ToBytes(value) {
    const bytes = new Uint8Array(4);
    const view = new DataView(bytes.buffer);
    view.setUint32(0, value, false);
    return bytes;
  }

  function bytesToUint32(bytes, offset) {
    const view = new DataView(bytes.buffer, bytes.byteOffset + offset, 4);
    return view.getUint32(0, false);
  }

  async function deriveAesKey(keyString, salt) {
    const rawKey = await crypto.subtle.importKey(
      "raw",
      stringToBytes(keyString),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: ITERATIONS,
        hash: "SHA-256"
      },
      rawKey,
      {
        name: "AES-GCM",
        length: 256
      },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function encryptString(keyString, plaintext) {
    if (typeof keyString !== "string") {
      throw new TypeError("keyString must be a string");
    }

    if (typeof plaintext !== "string") {
      throw new TypeError("plaintext must be a string");
    }

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const aesKey = await deriveAesKey(keyString, salt);

    const ciphertextBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv
      },
      aesKey,
      stringToBytes(plaintext)
    );

    const payload = {
      v: VERSION,
      alg: "AES-GCM",
      kdf: "PBKDF2-SHA256",
      iterations: ITERATIONS,
      salt: bytesToBase64(salt),
      iv: bytesToBase64(iv),
      ciphertext: bytesToBase64(new Uint8Array(ciphertextBuffer))
    };

    return STRING_PREFIX + btoa(JSON.stringify(payload));
  }

  async function decryptString(keyString, encryptedString) {
    try {
      if (typeof keyString !== "string") {
        return null;
      }

      if (typeof encryptedString !== "string") {
        return null;
      }

      if (!encryptedString.startsWith(STRING_PREFIX)) {
        return null;
      }

      const encodedPayload = encryptedString.slice(STRING_PREFIX.length);
      const payload = JSON.parse(atob(encodedPayload));

      if (
        payload.v !== VERSION ||
        payload.alg !== "AES-GCM" ||
        payload.kdf !== "PBKDF2-SHA256" ||
        payload.iterations !== ITERATIONS ||
        typeof payload.salt !== "string" ||
        typeof payload.iv !== "string" ||
        typeof payload.ciphertext !== "string"
      ) {
        return null;
      }

      const salt = base64ToBytes(payload.salt);
      const iv = base64ToBytes(payload.iv);
      const ciphertext = base64ToBytes(payload.ciphertext);

      const aesKey = await deriveAesKey(keyString, salt);

      const plaintextBuffer = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv
        },
        aesKey,
        ciphertext
      );

      return bytesToString(new Uint8Array(plaintextBuffer));
    } catch {
      return null;
    }
  }

  async function encryptBytes(keyString, plaintextBytes, metadata = {}) {
    if (typeof keyString !== "string") {
      throw new TypeError("keyString must be a string");
    }

    const plaintext = normalizeBytes(plaintextBytes);

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const aesKey = await deriveAesKey(keyString, salt);

    const ciphertextBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv
      },
      aesKey,
      plaintext
    );

    const header = {
      v: VERSION,
      alg: "AES-GCM",
      kdf: "PBKDF2-SHA256",
      iterations: ITERATIONS,
      salt: bytesToBase64(salt),
      iv: bytesToBase64(iv),

      // This metadata is not encrypted.
      // Do not put secret information here.
      metadata
    };

    const headerBytes = stringToBytes(JSON.stringify(header));
    const headerLengthBytes = uint32ToBytes(headerBytes.length);
    const ciphertextBytes = new Uint8Array(ciphertextBuffer);

    return concatBytes([
      FILE_MAGIC,
      headerLengthBytes,
      headerBytes,
      ciphertextBytes
    ]);
  }

  async function decryptBytes(keyString, encryptedBytes) {
    try {
      if (typeof keyString !== "string") {
        return null;
      }

      const encrypted = normalizeBytes(encryptedBytes);

      if (encrypted.length < FILE_MAGIC.length + 4) {
        return null;
      }

      for (let i = 0; i < FILE_MAGIC.length; i++) {
        if (encrypted[i] !== FILE_MAGIC[i]) {
          return null;
        }
      }

      const headerLengthOffset = FILE_MAGIC.length;
      const headerLength = bytesToUint32(encrypted, headerLengthOffset);

      const headerStart = FILE_MAGIC.length + 4;
      const headerEnd = headerStart + headerLength;

      if (headerEnd > encrypted.length) {
        return null;
      }

      const headerBytes = encrypted.slice(headerStart, headerEnd);
      const header = JSON.parse(bytesToString(headerBytes));

      if (
        header.v !== VERSION ||
        header.alg !== "AES-GCM" ||
        header.kdf !== "PBKDF2-SHA256" ||
        header.iterations !== ITERATIONS ||
        typeof header.salt !== "string" ||
        typeof header.iv !== "string"
      ) {
        return null;
      }

      const salt = base64ToBytes(header.salt);
      const iv = base64ToBytes(header.iv);
      const ciphertext = encrypted.slice(headerEnd);

      const aesKey = await deriveAesKey(keyString, salt);

      const plaintextBuffer = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv
        },
        aesKey,
        ciphertext
      );

      return {
        bytes: new Uint8Array(plaintextBuffer),
        metadata: header.metadata || {}
      };
    } catch {
      return null;
    }
  }

  return {
    encryptString,
    decryptString,
    encryptBytes,
    decryptBytes
  };
})();