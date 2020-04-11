// Imports
const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' });

// Declare local variables
const apiG = new AWS.APIGateway()
const apiId = 'vkj1a9jk16'

createDeployment(apiId, 'prod')
.then(data => console.log(data))

function createDeployment (apiId, stageName) {
  const params = {
    restApiId: apiId,
    stageName: stageName
  }

  return new Promise((resolve, reject) => {
    apiG.createDeployment(params, (err, data) => {
      if(err) reject(err);
      else resolve(data);
    })
  })
}
