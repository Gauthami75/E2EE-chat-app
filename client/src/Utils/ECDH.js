const crypto = require("crypto")

class ECDH{

    constructor(){
        this.algorithm = 'aes-256-ctr';
        this.alice = crypto.createECDH("secp256k1")
        this.alice.generateKeys()
        this.sharedKey = ""
    }

    getPublicKey(){
        return this.alice.getPublicKey().toString('base64')
    }

    getPrivateKey(){
        return this.alice.getPrivateKey().toString('base64')
    }

    getSecretKey(bob_publicKey){
        this.sharedKey = this.alice.computeSecret(bob_publicKey, 'base64', 'hex')
        return this.sharedKey
    }

    encryptMessage(MESSAGE){

        const IV = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(
            'aes-256-gcm',
            Buffer.from(this.sharedKey, 'hex'),
            IV
        );

        let encrypted = cipher.update(MESSAGE, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const auth_tag = cipher.getAuthTag().toString('hex');

        // console.table({
        // IV: IV.toString('hex'),
        // encrypted: encrypted,
        // auth_tag: auth_tag
        // });

        const payload = IV.toString('hex') + encrypted + auth_tag;

        const payload64 = Buffer.from(payload, 'hex').toString('base64');
        // console.log(payload64);
        return payload64;

    }

    decryptMessage(payload64){
        
        const bob_payload = Buffer.from(payload64, 'base64').toString('hex');

        const bob_iv = bob_payload.substr(0, 32);
        const bob_encrypted = bob_payload.substr(32, bob_payload.length - 32 - 32);
        const bob_auth_tag = bob_payload.substr(bob_payload.length - 32, 32);

        // console.table({ bob_iv, bob_encrypted, bob_auth_tag });

        try {
            const decipher = crypto.createDecipheriv(
                'aes-256-gcm',
                Buffer.from(this.sharedKey, 'hex'),
                Buffer.from(bob_iv, 'hex')
            );

            decipher.setAuthTag(Buffer.from(bob_auth_tag, 'hex'));

            let decrypted = decipher.update(bob_encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            // console.table({ DecyptedMessage: decrypted });

            return decrypted
        } catch (error) {
            console.log(error.message);
        }
    }    

}


module.exports = {ECDH};