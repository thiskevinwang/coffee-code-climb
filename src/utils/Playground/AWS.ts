import AWS from "aws-sdk"

AWS.config.update({
  apiVersion: "latest",
  region: "us-east-1",
  // credentials,
})

const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "latest",
  region: "us-east-1",
})

export { AWS, cognito }
