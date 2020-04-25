const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' });

const ssm = new AWS.SSM();
const secretName = 'peterSecret';

createSecret()
.then(data => retrieveSecret())
.then(console.log);

// create secret
function createSecret() {
    const params = {      
        Name: secretName,
        Value: 'password12232323',
        Type: 'SecureString',
        Overwrite: true   
      };
    return new Promise((resolve, reject) => {
        ssm.putParameter(params, (err, data) => {
            if(err) reject(err);
            else resolve(data);
        })
    })
}


// retrieve secret value
function retrieveSecret() {
    const params = {     
        Name: secretName,
        WithDecryption: true   
    };  
    return new Promise((resolve, reject) => {
       ssm.getParameter(params, (err, data) => {
            if(err) reject(err);
            else resolve(data);
       })
    }) 
}