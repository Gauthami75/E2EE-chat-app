const {ECDH} = require("./ECDH")

const ecdh_bob = new ECDH()
const ecdh_alice = new ECDH()

const bob_secret = ecdh_bob.getSecretKey(ecdh_alice.getPublicKey())
const alice_secret = ecdh_alice.getSecretKey(ecdh_bob.getPublicKey())

const MESSAGE = "This is Saumya jain";

const encrypted = ecdh_alice.encryptMessage(MESSAGE);
console.log("Encrypted : "+encrypted)

const decrypted = ecdh_bob.decryptMessage(encrypted)
console.log(decrypted)