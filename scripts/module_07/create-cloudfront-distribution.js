// Imports
const AWS = require('aws-sdk')
const cfParams = require('./cloudfront-parameters')

AWS.config.update({ region: 'eu-west-3' });

const cf = new AWS.CloudFront();
// TODO: Create CloudFront SDK Object

createDistribution('hamster-bucket-eskandar')
.then(data => console.log(data))

function createDistribution (bucketName) {
  // Create params const object
  const params = {
    DistributionConfig: {
      CallerReference: `${Date.now()}`,
      Comment: 'HBFL Distribution',
      DefaultCacheBehavior: cfParams.defaultCacheBehavior(bucketName),
      Origins: cfParams.origins(bucketName),
      HttpVersion: 'http2',
      PriceClass: 'PriceClass_100',
      IsIPV6Enabled: true,
      Enabled: true
    }
  }

  return new Promise((resolve, reject) => {
    //  Call createDistribution
    cf.createDistribution(params, (err, data) => {
      if(err) reject(err);
      else resolve(data);
    })
  })
}
