const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-2' });

const cw = new AWS.CloudWatch();

createCustomMetric()
.then(console.log)
.catch(console.log);

function createCustomMetric() {
    const metric = {
        MetricData: [ /* required */
          {
            MetricName: 'YOUR_METRIC_NAME', /* required */
            Dimensions: [
              {
                Name: 'URL', /* required */
                Value: '10' /* required */
              },
            /* more items */
            ],
            Timestamp: new Date(),
            Unit: 'Count',
            Value: 0
          },
          /* more items */
        ],
        Namespace: 'MyTestNamespace' /* required */
      };

    return new Promise((resolve, reject) => {
        cw.putMetricData(metric, (err, data) => {
            if(err) reject(err);
            else resolve(data);
        })
    });
}