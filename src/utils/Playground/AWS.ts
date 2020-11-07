import AWS from "aws-sdk"

const credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: process.env.IDENTITY_POOL_ID as string,
})

AWS.config.update({
  apiVersion: "latest",
  region: "us-east-1",
  credentials,
})

const cognito = new AWS.CognitoIdentityServiceProvider()

export { AWS, cognito }
