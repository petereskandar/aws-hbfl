// Imports
const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' });

// Declare local variables
const sns = new AWS.SNS();
const topicName = 'hamster-topic'

createTopic(topicName)
.then(data => console.log(data))

function createTopic (topicName) {
  // Create params const
  const params = {
    Name: topicName
  }

  return new Promise((resolve, reject) => {
    // Create topic
    sns.createTopic(params, (err, data) => {
      if(err) reject(err);
      else resolve(data);
    })
  })
}
