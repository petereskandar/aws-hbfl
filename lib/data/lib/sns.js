const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' });

const sns = new AWS.SNS()
const TOPIC_ARN = 'arn:aws:sns:eu-west-3:250950161175:hamster-topic'

function publish (msg) {
  // Create params const object
  const params = {
    TopicArn: TOPIC_ARN,
    Message: msg
  }

  return new Promise((resolve, reject) => {
    // Publish message
    sns.publish(params, (err, data) => {
      if(err) reject(err);
      else resolve(data);
    })
  })
}

//publish('Ciao Peter');

module.exports = { publish }
