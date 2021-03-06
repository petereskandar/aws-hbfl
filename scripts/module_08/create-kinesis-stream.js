// Imports
const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' });

// Declare local variables
// TODO: Create kinesis object
const kinesis = new AWS.Kinesis();
const streamName = 'hamster-race-results'

createKinesisStream(streamName)
.then(data => console.log(data))

function createKinesisStream (streamName) {
  // Create params const
  const params = {
    ShardCount: 1, // 1Mb/second
    StreamName: streamName,
  }

  return new Promise((resolve, reject) => {
    //  Create kinesis stream
    kinesis.createStream(params, (err, data) => {
      if(err) reject(err);
      else resolve(data);
    })
  })
}
