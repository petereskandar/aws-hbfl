// Imports
const AWS = require('aws-sdk')
const helpers = require('./helpers')
const sgName = 'hamster_redis_sg'

AWS.config.update({ region: 'eu-west-3' });

// TODO: Create an elasticache object
const ec = new AWS.ElastiCache();
const ec2 = new AWS.EC2();

helpers.createSecurityGroup(sgName, 6379)
.catch(err => getSecurityGroup(sgName).then(sgId => {
  createRedisCluster('hamster', 'sg-0f6b9db5b25a40793') 
}))
.then(sgId => createRedisCluster('hamster', sgId))
.then(data => console.log(data))

function createRedisCluster (clusterName, sgId) {
  const params = {
    CacheClusterId: clusterName,
    CacheNodeType: 'cache.t2.micro',
    Engine: 'redis',
    NumCacheNodes: 1, // for redis the max num is 1
    SecurityGroupIds: [
      sgId
    ]
  }

  return new Promise((resolve, reject) => {
    ec.createCacheCluster(params, (err, data) => {
      if(err) reject(err);
      else resolve(data);
    })
  })
}

function getSecurityGroup(sgName) {
  const params = {
    GroupNames :[
      sgName
    ]
  }
  return new Promise((resolve, reject) => {
    ec2.describeSecurityGroups(params, (err, data) => {
      if(err) reject(err);
      else resolve(data.GroupId);
    });
  });
}
