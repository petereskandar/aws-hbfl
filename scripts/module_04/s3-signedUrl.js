// Imports
const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' });
const s3 = new AWS.S3();

getS3SignedUrl()
.then(console.log);

getS3SignedUrlPUT('Capture.PNG')
.then(console.log);

/**
 * Get signed url for specific object
 */
function getS3SignedUrl() {
    const params = {
        Bucket: 'petereskandarbucket',
        Key: 'peter.jpg'
    }

    return new Promise((resolve, reject) => {
        s3.getSignedUrl('getObject', params, (err, data) => {
            if(err) reject(err);
            else resolve(data);
        })
    });
}


/**
 * Get signed url for Put Object
 * uploading an object to S3
 */
function getS3SignedUrlPUT(fileName) {
    const params = {
        Bucket: 'petereskandarbucket',
        Key: fileName
    }

    return new Promise((resolve, reject) => {
        s3.getSignedUrl('putObject', params, (err, data) => {
            if(err) reject(err);
            else resolve(data);
        })
    });
}
