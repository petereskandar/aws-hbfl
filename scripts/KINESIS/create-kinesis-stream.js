// Imports
const AWS = require('aws-sdk')
const helpers = require('./helpers')

AWS.config.update({ region: 'eu-west-3' });
const kinesis = new AWS.Kinesis(); // kinesis
const lambda = new AWS.Lambda(); // lambda

const streamName = 'sns-notification-stream';
const kinesisArn = 'arn:aws:kinesis:eu-west-3:250950161175:stream/sns-notification-stream';
const functionName = 'sns-notification-stream-consumer'
let roleArn

/**
 * Steps are 
 * 1 - create Lambda role and attaching policies
 * 2 - zip lambda index.js 
 * 3 - create Lambda function
 * 4 - create trigger
 */
helpers.createLambdaKinesisRole()
.then((arn) => {
    roleArn = arn;
    // create a zip file containig lambda function index.js
    return helpers.zipLambdaFile()
})
.then((codeBuffer) => createLambda(roleArn, functionName, codeBuffer))
.then(() => createTrigger(kinesisArn, functionName))
.then(console.log)
.catch(console.log);

// create lambda function as a stream consumer
function createLambda (roleArn, lambdaName, zippedCode) {
    const params = {
      Code: {
        ZipFile: zippedCode
      },
      FunctionName: lambdaName,
      Handler: 'index.handler',
      Role: roleArn,
      Runtime: 'nodejs12.x',
      Description: 'A kinesis consumer for to send sns notifications',
      MemorySize: 128,
      Publish: true,
      Timeout: 15
    }
  
    return new Promise((resolve, reject) => {
      lambda.createFunction(params, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }
  
  function createTrigger (kinesisArn, lambdaName) {
    // Create params const for trigger
    const params = {
      EventSourceArn: kinesisArn,
      FunctionName: lambdaName,
      StartingPosition: 'LATEST',
      BatchSize: 100
    }
  
    return new Promise((resolve, reject) => {
      lambda.createEventSourceMapping(params, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }

  function createStream() {
    const params = {
        ShardCount: 1, // 1Mb/second
        StreamName: streamName,
    }

    return new Promise((resolve, reject) => {
        kinesis.createStream(params, (err, data) => {
            if(err) reject(err);
            else resolve(data);
        });
    })
}