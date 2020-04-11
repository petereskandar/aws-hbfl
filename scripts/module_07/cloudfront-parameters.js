function origins (bucketName) {
  return {
    // Add properties for Origins
    Quantity: 1, // origins for static files - in our case is just one (S3 bucket)
    Items: [ // the configuration for each single origin
      {
        DomainName: `${bucketName}.s3.amazonaws.com`,
        Id: `${bucketName}_origin`, // unique value for the origin
        S3OriginConfig: {
          OriginAccessIdentity: ''
        }
      }
    ]
  }
}
function defaultCacheBehavior (bucketName) {
  return {
    // Add properties for DefaultCacheBehavior
    ForwardedValues: {
      Cookies: {
        Forward: 'none'
      },
      QueryString: false
    },
    MinTTL: 0,
    TargetOriginId: `${bucketName}_origin`,
    TrustedSigners: {
      Quantity: 0,
      Enabled: false
    },
    ViewerProtocolPolicy: 'redirect-to-https',
    AllowedMethods: {
      Quantity: 2,
      Items: [
        'GET',
        'HEAD'
      ],
      CachedMethods: {
        Quantity: 2,
        Items: [
          'GET',
          'HEAD'
        ]
      }
    }
  }
}

module.exports = {
  origins,
  defaultCacheBehavior
}
