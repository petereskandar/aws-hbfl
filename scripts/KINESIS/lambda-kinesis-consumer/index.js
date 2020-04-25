const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' });

const sns = new AWS.SNS();
const TOPIC_ARN = 'arn:aws:sns:eu-west-3:250950161175:siredWeb-topic';

exports.handler = (event, context, callBack) => {
    publishMsg()
    .then(data => callBack(data))
    .catch(err => callBack(err));
}

function publishMsg() {
    const params = {
        TopicArn: topicArn,
        Message: msg
    }
    return new Promise((resolve, reject) => {
        sns.publish(params, (err, data) => {
            if(err) reject(err);
            else resolve(data);
        })
    })
}