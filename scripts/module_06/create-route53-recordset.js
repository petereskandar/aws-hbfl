// Imports
const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' });

// Declare local variables
const route53 = new AWS.Route53()
const hzId = '/hostedzone/Z02608542LZM7F432TJ6N'

createRecordSet(hzId)
.then(data => console.log(data))

function createRecordSet (hzId) {
  const params = {
    HostedZoneId: hzId,
    ChangeBatch: {
      Changes: [
        {
          Action: 'CREATE',
          ResourceRecordSet: {
            Name: 'hbfl.online',
            Type: 'A',
            AliasTarget: {
              DNSName: 'hamsterELB-1466744753.eu-west-3.elb.amazonaws.com',
              EvaluateTargetHealth: false,
              HostedZoneId: 'Z3Q77PNBQS71R4' // HostedZoneId of the resource (the ELB)
            }
          }
        }
      ]
    }
  }
  // Link to ELB Regions:
  // https://docs.aws.amazon.com/general/latest/gr/elb.html

  return new Promise((resolve, reject) => {
    route53.changeResourceRecordSets(params, (err, data) => {
      if(err) reject(err);
      else resolve(data);
    });
  })
}
