// Imports
const AWS = require('aws-sdk')
const helpers = require('./helpers')

AWS.config.update({ region: 'eu-west-3' });

// Declare local variables
const dynamoClient = new AWS.DynamoDB.DocumentClient();

helpers.getHamsterData()
.then(data => populateTable('hamsters', data))
.then(() => helpers.getRaceData())
.then(data => populateTable('races', data))
.then(data => console.log(data))

function populateTable (tableName, data) {
  const params = {
    RequestItems: {
      [tableName]: data.map(item => {
        return {
          PutRequest: {
            Item: item
          }
        }
      })
    }
  }

  return new Promise((resolve, reject) => {
    dynamoClient.batchWrite(params, (err, data) => {
      if(err) reject(err);
      else resolve(data);
    });
  })
}
