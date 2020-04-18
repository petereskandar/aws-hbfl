/**
 * @author [p.eskandar]
 * @email [eskandar.peter@accenture.com]
 * @create date 2020-04-18 21:35:18
 * @modify date 2020-04-18 21:35:18
 * @desc [delete all dynamoDB tables under AWS Account]
 */


// Imports
const AWS = require('aws-sdk');
const tableList = require('./dynamo-all-tables');

AWS.config.update({ region: 'eu-west-3' });

// Declare local variables
const dynamo = new AWS.DynamoDB();

tableList.getDynamoTables()
.then(tableList => deleteAllDynamoTable(tableList.TableNames))
.catch(console.log('Nothing to delete'));

function deleteAllDynamoTable(tableNames) {
    return new Promise((resolve, reject) => {
        const tableDelPromises = tableNames.map((tableName) => {
            const params = {
                TableName: tableName
            }
            console.log(params);
            dynamo.deleteTable(params, (err, data) => {
                if(err) reject(err);
                else resolve(data);
            })
        });

        Promise.all(tableDelPromises)
        .then(resolve)
        .catch(reject)
    })
}
