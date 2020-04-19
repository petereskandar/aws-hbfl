const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' });

const sqs = new AWS.SQS();
const RACE_QUEUE = 'hamster-race-results'

pushMsg(RACE_QUEUE, 'Ciao this is a second message');

function pushMsg(queueName, msg) {
    const params = {
        QueueName: queueName
    }

    return new Promise((resolve, reject) => {
        sqs.getQueueUrl(params, (err, data) => {
            if(err) reject(err);
            else {
                const params = {
                    MessageBody: JSON.stringify(msg),
                    QueueUrl: data.QueueUrl
                }

                sqs.sendMessage(params, (err) => {
                    if(err) reject(err);
                    else resolve('Msg Sent Successfully');
                })
            }
        })
    });
}