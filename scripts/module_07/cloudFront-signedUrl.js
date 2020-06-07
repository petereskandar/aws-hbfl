const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-2' });

const cloudFront = new AWS.CloudFront.Signer('', '');

getCloudFrontSignedURL()
.then(console.log)
.catch(console.log);

function getCloudFrontSignedURL() {
    const params = {
        url: 'd1i0q7qyb3wpk2.cloudfront.net/peter.jpg',
        expires: Math.floor((new Date()).getTime() / 1000) + (60 * 60 * 1) // Current Time in UTC + time in seconds, (60 * 60 * 1 = 1 hour)
    }

    return new Promise((resolve, reject) => {
        cloudFront.getSignedUrl(params, (err, url) => {
            if(err) reject(err);
            else resolve(url);
        });
    })
}