// Imports
const AWS = require('aws-sdk')
const helpers = require('./helpers')

AWS.config.update({ region: 'eu-west-3' });

// Declare local variables
const s3 = new AWS.S3()
const bucketName = 'hamster-bucket-eskandar'

helpers.getPublicFiles()
.then(files => uploadS3Objects(bucketName, files))
.then(data => console.log(data))

function uploadS3Objects (bucketName, files) {
 const params = {
   Bucket: bucketName,
   ACL: 'public-read'
 }

  const filePromises = files.map((file) => {
    console.log(file);
    const newParams = Object.assign({}, params, {
      Body: file.contents,
      Key: file.name,
      ContentType: helpers.getContentType(file.name)
    })

    return new Promise((resolve, reject) => {
      s3.putObject(newParams, (err, data) => {
        if(err) reject(err);
        else resolve(data);
      })
    })
  })

  return Promise.all(filePromises)
}
