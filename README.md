# lambda-mysql-auto-backup
Function to be executed inside lambda to perform mysql backups

## How to use
0. Clone this repository
1. Open Secrets Manager in you AWS Console
2. Click in Add new secret
3. Choose Credentials for another database
4. Put your user and password for your database
5. Choose MySQL in Database type
6. Fill Server Address, name of your database and port
7. Configure your .env file or pass in Github actions (like I do) (set all values of inside .env file)
8. Go to IAM > Users > (your-user) > Add Permissions > Attach Policies Directly.
9. Create a Custom IAM Policy. Use the policy below to grant access to the specific secret:
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowGetSpecificSecret",
      "Effect": "Allow",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": "arn:aws:secretsmanager:us-east-1:991856824586:secret:YOURSECRETNAME)-*"
    }
  ]
}
```

10. Create a function in AWS Lampda with name and set secret in Github secrets with LAMBDA_FUNCTION_NAME