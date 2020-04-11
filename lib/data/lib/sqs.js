const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' });

const sqs = new AWS.SQS()

function push (queueName, msg) {
  // Create params const to get queue URL
  const params = {
    QueueName: queueName
  }

  return new Promise((resolve, reject) => {
    // Get sqs queue URL
    // Then send message to queue url
    sqs.getQueueUrl(params, (err, data) => {
      if(err) reject(err);
      else {
        const params = {
          MessageBody: JSON.stringify(msg),
          QueueUrl: data.QueueUrl
        }

        // send message to SQS 
        sqs.sendMessage(params, (err) => {
          if(err) reject(err);
          else resolve();
        })
      }
    })
  })
}

module.exports = { push }
