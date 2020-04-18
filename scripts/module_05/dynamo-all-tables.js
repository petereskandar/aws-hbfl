// Imports
const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' });

// Declare local variables
const dynamo = new AWS.DynamoDB();

function getDynamoTables() {
    return new Promise((resolve, reject) => {
        dynamo.listTables({} , (err, data) => {
            if(err) reject(err);
            else resolve(data);
        })
    })
}

module.exports = {
    getDynamoTables
}