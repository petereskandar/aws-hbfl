// jwt token verification
const jsonwebtoken = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');


const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-2' });

const roleArn = 'arn:aws:iam::250950161175:role/S3FullAccessAssumeRole';
const jwk = '{"alg":"RS256","e":"AQAB","kid":"vpZ1C9GrsbToVABSgSBKR0H+iX5TU8ls7epuHoqqFR4=","kty":"RSA","n":"pAWqAJIXexlsSacmZCt9wEIu6z0z2CFd4s-RGE80lu85KunZzqlSeyzYXD-sa7VW8YVz0Yovub1r2GkQ0tGgMtdKFtEwQLuFtqSOlH8RsOdvGEy-xa9KWzKomkWNWBzGgLLN-v4CJKhxAz9p91F6N1CFraT_A9UTJVocC3M-QNjPL_KtH-CiiI2Ru4nQQ_ftBPnnVzGs8i73DWxe9ZCVgv_KoTfhm6KV5B-G_g-GdZIqrLCppUab6OomP8JEGPw4muduUgyEQdp0DK2yfQTtZPiB-iebbKuTbz1ESkZTX63UsMUrIXfnFuN2TZhLGYBjWPf2ZoagkC8TsYF-rskCDQ","use":"sig"}';
const cognitoToken = 'eyJraWQiOiJ2cFoxQzlHcnNiVG9WQUJTZ1NCS1IwSCtpWDVUVThsczdlcHVIb3FxRlI0PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmYWYxNzJlZS1lY2I2LTQ0YjctYmExNi1kZDhiNGFhNzdiMzkiLCJjb2duaXRvOmdyb3VwcyI6WyJTM0dyb3VwIl0sImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTIuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0yX2xDa0Z5RlBVSyIsInZlcnNpb24iOjIsImNsaWVudF9pZCI6ImtiaGtvMHVqcW1ub3ZjbTYwMmU4ODNhMWUiLCJldmVudF9pZCI6IjdlNWEzYmUyLWQ4ODgtNDgxMy04NWQ2LWIzYmNhYjc5YmQ2NiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4gcGhvbmUgb3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhdXRoX3RpbWUiOjE1ODc2NzMzODUsImV4cCI6MTU4NzY3Njk4NSwiaWF0IjoxNTg3NjczMzg1LCJqdGkiOiJkNDNiZTUzZC1mYWI5LTQwODYtOTIyNC1kYjhlNTMwMDA5NGEiLCJ1c2VybmFtZSI6InBldGVyX2Vza2FuZGFyIn0.gILTI0aa87I_yGj57A98uKkrsM9DVVK6dmwRlULjgWmTxiPlC4uoY-usUJXDAOsQ_5AVF4rcLtQSaPRdw63F297wkJapNBKivLIpmQ75MN2Hd8KArCvdwIh1P5adAN9JtDkIFGFoOSSimXncnTCtsHDcdrhfNIU3lALxEn4lojpxv461cXrp7gJgPsReXsGL_Nrf4urFszDj1BSUMugDaTk7wqmiOBp_5lwwBVZH5MHH0M6o5GIF0W3Nzd5saPL3_9StmmGk_2LLAXxdVzMUiUfWnJ5obHL_xHViCzhPOWmhEMIJJh0h1EE2TTEUvA0XcKM4fyqSuuYXWXO-qh0yWQ';
const cognitoTokenId = 'eyJraWQiOiJkOVdMWVQ0dUpGTkt3NVA2ZXZoYzhYRlk3R1haOTl1QlFnbDBCbXQxdmljPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiNERXNElkeHpJSHloRUVzeDIxWC1UdyIsInN1YiI6ImZhZjE3MmVlLWVjYjYtNDRiNy1iYTE2LWRkOGI0YWE3N2IzOSIsImNvZ25pdG86Z3JvdXBzIjpbIlMzR3JvdXAiXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTIuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0yX2xDa0Z5RlBVSyIsImNvZ25pdG86dXNlcm5hbWUiOiJwZXRlcl9lc2thbmRhciIsImNvZ25pdG86cm9sZXMiOlsiYXJuOmF3czppYW06OjI1MDk1MDE2MTE3NTpyb2xlXC9TM0Z1bGxBY2Nlc3NBc3N1bWVSb2xlIl0sImF1ZCI6ImtiaGtvMHVqcW1ub3ZjbTYwMmU4ODNhMWUiLCJldmVudF9pZCI6IjdlNWEzYmUyLWQ4ODgtNDgxMy04NWQ2LWIzYmNhYjc5YmQ2NiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTg3NjczMzg1LCJleHAiOjE1ODc2NzY5ODUsImlhdCI6MTU4NzY3MzM4NSwiZW1haWwiOiJwZXRlcndhZGlkMUBnbWFpbC5jb20ifQ.I1z-Vx5H6u62bLdOnLb3uoRifCSYBDQJOWP8eh5VD307OpnXI3pFzbIjAzFQ0TTZIhsHcwYZcPw2wxu9QwmXM9kY5R8UU2M4ly8iAM8t3wHwG6WlTYl12H8t78MiNojL0I2mzYw3vVEyXrvqkwUs-8byk81cqckFRgqqjSNrVIl9pM8CJogX4CGu6Q1t00a2mCvEwF9qAl-XUfP7mBZQAxmEdKHamiQHOB5F-RlZJu2vWF6YIuBw06I6wGrPTEJ9hm5KiTXSpT_lEho-aJmErSJEgSp0LhsnYbc1PYOPtL9Y2BEBeDaPSfJbexIZ7U9Z3z9yWlCzrKRpRO3ErGP9RQ';
const pem = jwkToPem(JSON.parse(jwk));

/**
 * check if token is valid
 * then assumeRole
 */
getOpenIdToken()
.then(console.log)
.catch(console.log);
/*verifyJwtToken(cognitoToken, pem)
.then(token => getCrossAccountCredentials(roleArn))
.then(console.log)
.catch(console.log)*/


function getCrossAccountCredentials(roleArn) {


    const sts = new AWS.STS;

    const params = {
      RoleArn: roleArn,
      RoleSessionName: 'awssdk',
      WebIdentityToken: cognitoToken
    };

    return new Promise((resolve, reject) => {
        sts.assumeRoleWithWebIdentity(params, (err, data) => {
            if(err) reject(err);
            else resolve(data);
        })
    })
}

// check token validation
function verifyJwtToken(token, pem) {
    return new Promise((resolve, reject) => {
        jsonwebtoken.verify(token, pem, function(err, decoded) {
          if(err) reject(err);
          else resolve(token);
        });
    })
}

function getOpenIdToken() {
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'eu-west-2:e3e5812d-660b-4fbe-9f5f-54a28354a2a8',
        Logins: {
            'cognito-idp.eu-west-2.amazonaws.com/eu-west-2_lCkFyFPUK': cognitoToken
        }
    });
    return new Promise((resolve, reject) => {
        try {
         AWS.config.credentials.get(function() {
             console.log(AWS.config.credentials);
            
            const sts = new AWS.STS();
            const params = {
              RoleArn: roleArn,
              RoleSessionName: 'awssdk',
              WebIdentityToken: cognitoTokenId
            };
        
            sts.assumeRoleWithWebIdentity(params, (err, data) => {
                if(err) reject(err);
                else resolve(data);
            })
         });
        } catch (error) {
            reject(error);
        }
    })

}

/*
const main = async () => {
  // Get the Cross account credentials
  const accessparams = await getCrossAccountCredentials();
  // Get the ec2 service for current account
  const ec2 = new AWS.EC2();
  // Get the ec2 service for cross account role
  const ca_ec2 = new AWS.EC2(accessparams);
  // Get the autoscaling service for current account
  const autoscaling = new AWS.AutoScaling();
  // Get the autoscaling service for cross account role
  const ca_autoscaling = new AWS.AutoScaling(accessparams);

  // This will describe instances within the cross account role
  ca_ec2.describeInstances(...) 

  // This will describe instances within the original account
  ec2.describeInstances(...)

  // Here you can access both accounts without issues.
}
*/