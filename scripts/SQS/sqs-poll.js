const AWS = require('aws-sdk')
AWS.config.update({ region: 'eu-west-3' });

const sqs = new AWS.SQS();
const RACE_QUEUE = 'hamster-race-results'

init();

function init() {
    return Promise.resolve(setInterval(() => {
        poll()
        .then(msg => console.log(`${new Date()} - ${JSON.stringify(msg)}`))
        .catch(err => console.error(`${new Date()} - ${err}`))
    }, 5000));
}

function poll() {
    const params = {
        QueueName : RACE_QUEUE
    }

    return new Promise((resolve, reject) => {
        sqs.getQueueUrl(params, (err, data) => {
            if(err) reject(err);
            else {
                // Create params const for receiving message
                const params = {
                    QueueUrl: data.QueueUrl,
                    MaxNumberOfMessages: 10,
                    VisibilityTimeout: 15
                }
                const url = data.QueueUrl;
                sqs.receiveMessage(params, (err, data) =>{
                    if(err) reject(err);
                    else {
                        if(!data.Messages || !data.Messages.length) {
                            resolve(`No messages in queue ${RACE_QUEUE}`)
                        } else {
                            deleteMsgAfterProcess(data.Messages, url)
                            .then(() => `Processed ${data.Messages} messages from SQS`);

                            return poll();
                        }
                    }
                });
            }
        })
    })
}

function deleteMsgAfterProcess(messages, queueUrl) {
  const deleteMsgs = messages.map((msg) => {
    const params = {
        QueueUrl: queueUrl,
        ReceiptHandle: msg.ReceiptHandle
    }
    console.log(params);
    return new Promise((resolve, reject) => {
        sqs.deleteMessage(params, (err, data) => {
            if(err) reject(err);
            else resolve(data);
        })
    })
  });

  return Promise.all(deleteMsgs);
}