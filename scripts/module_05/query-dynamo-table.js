const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' });

const client = new AWS.DynamoDB.DocumentClient()

get('hamsters', 1)
.then(console.log);

function getAll (tableName) {
  const params = {
    TableName: tableName
  }

  return new Promise((resolve, reject) => {
    client.scan(params, (err, data) => {
      if(err) reject(err);
      else resolve(data.Items);
    })
  })
}

function get (tableName, id) {
    const params = {
      TableName: tableName,
      ProjectionExpression: 'id, #n, #t',
      KeyConditionExpression: 'id = :hkey',
      ExpressionAttributeValues: {
        ':hkey': +id
      },
      ExpressionAttributeNames :{
          '#n': 'name',
          '#t': 'type'
      }
    }
  
    return new Promise((resolve, reject) => {
      client.query(params, (err, data) => {
        if(err) reject(err);
        else resolve(data.Items[0])
      })
    })
  }