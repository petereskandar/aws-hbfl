// Imports
const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' });

// Declare local variables
const cw = new AWS.CloudWatch()
const alarmName = 'hamster-elb-alarm'
const topicArn = 'arn:aws:sns:eu-west-3:250950161175:hamster-topic'
const tg = 'targetgroup/hamsterTG/9445870982ea9443' // target group ARN
const lb = 'app/hamsterELB/095cd96c720e1eb3' // load Balancer ARN

createCloudWatchAlarm(alarmName, topicArn, tg, lb)
.then(data => console.log(data))

function createCloudWatchAlarm (alarmName, topicArn, tg, lb) {
  // Create params const object
  const params = {
    AlarmName: alarmName,
    ComparisonOperator: 'LessThanThreshold',
    EvaluationPeriods: 1,
    MetricName: 'HealthyHostCount',
    Namespace: 'AWS/ApplicationELB',
    Period: 60,
    Threshold: 1,
    AlarmActions: [
      topicArn
    ],
    Dimensions: [
      {
        Name: 'TargetGroup',
        Value: tg
      }, {
        Name: 'LoadBalancer',
        Value: lb
      }
    ],
    Statistic: 'Average',
    TreatMissingData: 'breaching'
  }

  return new Promise((resolve, reject) => {
    // Call putMetricAlarm
    cw.putMetricAlarm(params, (err, data) => {
      if(err) reject(err);
      else resolve(data);
    })
  })
}
