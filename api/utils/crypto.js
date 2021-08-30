const sodium = require('sodium-native')
const { ENV } = require('@api/api.config.js')

const key = Buffer.from(ENV.ENCRYPT_TOKEN_KEY, 'hex')

const defaultMsgFormat = 'utf8'
const encodingFormat = 'base64'

const nonceByteSize = sodium.crypto_secretbox_NONCEBYTES
const nonceEncSize = Buffer.alloc(nonceByteSize).toString(encodingFormat).length
const macByteSize = sodium.crypto_secretbox_MACBYTES

module.exports = {
  Encrypt (message, key, msgFormat) {
    const nonce = Buffer.alloc(nonceByteSize)
    const ciphertext = Buffer.alloc(message.length + macByteSize)

    sodium.randombytes_buf(nonce)
    sodium.crypto_secretbox_easy(ciphertext, Buffer.from(message, msgFormat ?? defaultMsgFormat), nonce, key)

    return nonce.toString(encodingFormat) + ciphertext.toString(encodingFormat)
  },

  Decrypt (fullEncryptedMsg, key, msgFormat) {
    const nonce = Buffer.from(fullEncryptedMsg.substring(0, nonceEncSize), encodingFormat)
    const encryptedMsg = Buffer.from(fullEncryptedMsg.substring(nonceEncSize, fullEncryptedMsg.length), encodingFormat)
    const message = Buffer.alloc(encryptedMsg.length - macByteSize)

    sodium.crypto_secretbox_open_easy(message, encryptedMsg, nonce, key)

    return message.toString(msgFormat ?? defaultMsgFormat)
  },

  EncryptJSON (json) {
    return module.exports.Encrypt(JSON.stringify(json), key)
  },

  DecryptJSON (encryptedJson) {
    return JSON.parse(module.exports.Decrypt(encryptedJson, key))
  }
}
