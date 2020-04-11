// Imports
const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' })

// Declare local variables
const ec2 = new AWS.EC2()
const volumeId = 'vol-0eb3a3572e59d0300' // volume Id attached to the stopped instance
const instanceId = 'i-0187e2082eaf93907' // newly created instance

detachVolume(volumeId)
.then(() => attachVolume(instanceId, volumeId))

function detachVolume (volumeId) {
  const params = {
    VolumeId: volumeId,
  }

  return new Promise((resolve, reject) => {
    ec2.detachVolume(params, (err, data) => {
      if(err) reject(err);
      else resolve(err);
    })
  })
}

function attachVolume (instanceId, volumeId) {
  const params = {
    InstanceId: instanceId,
    VolumeId: volumeId,
    Device: '/dev/sdf'
  }

  return new Promise((resolve, reject) => {
    ec2.attachVolume(params, (err, data) => {
      if(err) reject(err);
      else resolve(data);
    })
  })
}
