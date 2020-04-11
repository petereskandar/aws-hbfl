const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' });

const kinesis = new AWS.Kinesis()

function send (streamName, partition, msg) {
  // Create params const object
  const params = {
    Data: JSON.stringify(msg),
    PartitionKey: partition, // an id for each shard
    StreamName: streamName
  }

  kinesis.putRecord(params, (err, data) => {
    if (err) return console.error(err)
    else console.log(`Put Kinesis record with: ${JSON.stringify(data)}`)
  })
}

module.exports = { send }
