// Imports
const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' });

// Declare local variables
const sns = new AWS.SNS()
const type = 'email'
const endpoint = 'eskandar.peter@accenture.com'
const topicArn = 'arn:aws:sns:eu-west-3:250950161175:hamster-topic'

createSubscription(type, topicArn, endpoint)
.then(data => console.log(data))

function createSubscription (type, topicArn, endpoint) {
  //  Create params const
  const params = {
    Protocol: type,
    TopicArn: topicArn,
    Endpoint: endpoint
  }

  return new Promise((resolve, reject) => {
    // Subscribe
    sns.subscribe(params, (err, data) => {
      if(err) reject(err);
      else resolve(data);
    });

  })
}
