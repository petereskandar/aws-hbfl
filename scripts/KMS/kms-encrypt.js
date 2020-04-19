// Imports
var Blob = require('node-blob');
const AWS = require('aws-sdk');
const helper = require('./helper');

AWS.config.update({ region: 'eu-west-3' })

// Declare local variables
const kms = new AWS.KMS();
const keyId = '99a79fe1-de68-48c1-91a3-a7fe40fee01d';

/*helper.getTextFile('./test.txt')
.then(buffer => encryptData(buffer))
.then(encryptedData => helper.saveBlobToFile(encryptedData, 'encryptedData.txt'))
.then(data => helper.getTextFile('./encryptedTxt.txt'))
.then(buffer => decryptData(buffer))
.then(plainText => helper.saveBlobToFile(plainText, 'plainText.txt')) // plaintext
.catch(console.log);*/

// KMS ReEncrypt
helper.getTextFile('./encryptedTxt.txt')
.then(buffer => kmsReEncrypt(buffer))
.then(encryptedData => helper.saveBlobToFile(encryptData, 'newlyEncrypted.txt'))



function encryptData(buffer) {
    const params = {
        KeyId: keyId,
        Plaintext: buffer
    }
    return new Promise((resolve, reject) => {
        kms.encrypt(params, (err, data) => {
            if(err) reject(err);
            else resolve(data.CiphertextBlob);
        })
    })
}

function decryptData(buffer) {
    const params = {
        CiphertextBlob: buffer
    }
    return new Promise((resolve, reject) => {
        kms.decrypt(params, (err, data) => {
            if(err) reject(err);
            else resolve(data.Plaintext);
        })
    })
}

// reencrypt data using a new destination CMK
function kmsReEncrypt(buffer) {
    const buff = new Buffer.from(buffer, 'base64');
    const params = {
        CiphertextBlob: buff,
        DestinationKeyId: keyId
    }
    return new Promise((resolve, reject) => {
        kms.reEncrypt(params, (err, data) => {
            if(err) reject(err);
            else resolve(data.CiphertextBlob)
        });
    });
}