const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' });

const kinesis = new AWS.Kinesis();

const KINESIS_STREAM_NAME = 'sns-notification-stream'
const PARTITION_KEY = 'sns-partition'

send(KINESIS_STREAM_NAME, PARTITION_KEY, 'Ciao Peter')
.then(console.log)
.catch(console.log);

function send(streamName, partition, msg) {
    const params = {
        Data: JSON.stringify(msg),
        PartitionKey: partition, // an id for each shard
        StreamName: streamName
    }

    return new Promise((resolve, reject) => {
        kinesis.putRecord(params, (err, data) => {
            if(err) reject(err)
            else resolve(data);
        })
    });
}