# lambda-mysql-auto-backup
Function to be executed inside AWS Lambda to perform MySQL backups.

## How to Use
### 1. Clone the Repository
- Clone this repository to your local environment.

### 2. Set Up Secrets Manager in AWS Console
- Open **Secrets Manager** in your AWS Console.
- Click **Add new secret**.
- Select **Credentials for another database**.
- Enter your database **username** and **password**.
- Select **MySQL** as the database type.
- Provide the **server address**, **database name**, and **port**.

### 3. Configure Environment Variables
- Create a `.env` file and set all necessary values (e.g., AWS keys, database credentials).
- Alternatively, pass environment variables via **GitHub Actions**.

### 4. Configure IAM User and Permissions
- Go to **IAM > Users > (your-user) > Add Permissions > Attach Policies Directly**.
- Create a **Custom IAM Policy** with the following permissions to access Secrets Manager:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowGetSpecificSecret",
      "Effect": "Allow",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": "arn:aws:secretsmanager:us-east-1:991856824586:secret:YOURSECRETNAME-*"
    }
  ]
}
```
- Attach the **AmazonS3FullAccess** policy to enable S3 uploads.

### 5. Deploy the Lambda Function
- Create a new function in **AWS Lambda** with a suitable name.
- Set the Lambda function name as `LAMBDA_FUNCTION_NAME` in your GitHub Secrets.
- Increase **timeout** to **1 minute** and allocate sufficient **memory**.

### 6. Verify and Test
- Run the function manually to ensure proper operation.
- Check **CloudWatch Logs** for execution results.

### 7. Maintain Security
- Rotate AWS credentials periodically.
- Limit access to Secrets Manager and S3 buckets with appropriate IAM roles.

# Schedule AWS Lambda to Run Daily at 03:00 AM (Brazil Time)

Follow these steps to schedule your AWS Lambda function to execute every day at 03:00 AM (Brasilia Time, UTC-3) using Amazon EventBridge.

## Step 1: Open AWS Lambda
1. Go to the [AWS Management Console](https://aws.amazon.com/console/).
2. Navigate to **Lambda** under the "Compute" section.
3. Select your **Lambda function** from the list.

## Step 2: Create an EventBridge Rule
1. In the AWS Console, search for and open **Amazon EventBridge**.
2. Click **Create rule**.
3. Enter a **name** for the rule (e.g., `daily-mysql-backup`).
4. **Rule type:** Select **Schedule**.
5. **Schedule pattern:** Choose **Cron expression**.
6. Enter the following cron expression to run at 03:00 AM Brazil Time (UTC-3):
   ```
   0 6 * * ? *
   ```
   > **Explanation:** 03:00 AM Brazil Time (UTC-3) = 06:00 AM UTC.

## Step 3: Configure Target
1. Under **Target**, select **AWS service**.
2. Choose **Lambda function**.
3. Select your **Lambda function name**.

## Step 4: Set Permissions
1. Select **Create a new role for this specific resource**.
2. **Review and create** the rule.

## Step 5: Verify Schedule
1. Return to your **Lambda function** dashboard.
2. Go to the **Configuration** tab and then to **Triggers**.
3. Confirm that the **EventBridge** rule appears as a trigger.

## Step 6: Test Manually (Optional)
You can test the Lambda function manually from the **Test** button in the AWS Lambda console to ensure everything works correctly.

## Step 7: Monitor Execution
1. Use **Amazon CloudWatch** to monitor logs and check if the function runs as expected every day at 03:00 AM Brazil Time.
2. Review logs for any errors or issues.

---
✅ **Done! Your AWS Lambda function will now run daily at 03:00 AM (Brazil Time).** 🚀