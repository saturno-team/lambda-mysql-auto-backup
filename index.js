import mysqldump from 'mysqldump';
import dotenv from "dotenv";
import { v4 as uuidv4 } from 'uuid';
import aws from 'aws-sdk';
import {
    SecretsManagerClient,
    GetSecretValueCommand,
  } from "@aws-sdk/client-secrets-manager";

export const handler = async (event) => {
  try {
    dotenv.config();
    const credentials = await getDatabaseCredentials();
    console.log('Credentials recovered');

    const filename = `cleiton_backup_mysql_${new Date().toJSON().slice(0, 10)}_${Math.random().toString(36).slice(2, 10)}.sql`;

    const { dump } = await mysqldump({
      connection: {
        host: credentials.host,
        user: credentials.username,
        password: credentials.password,
        database: credentials.dbname,
      },
    });
    console.log('Backup generated');
    console.log('Uploading...');

    await uploadFile(
      dump.data, 'text/sql', {
      key: filename,
      bucket: process.env.AWS_BUCKET,
    });
    console.log('Backup successful!');

  } catch (error) {
    console.log(error);
  }
  const response = {
    statusCode: 200,
  };
  return response;
};

async function getDatabaseCredentials() {
    try {
        const client = new SecretsManagerClient({
            region: process.env.AWS_REGION,
        });
        const response = await client.send(
        new GetSecretValueCommand({
            SecretId: process.env.SECRET_NAME,
            VersionStage: "AWSCURRENT",
        })
        );
        return JSON.parse(response.SecretString);
    } catch (error) {
        console.error("Error in search secret:", error);
        throw new Error("Error on search credentials");
    }
}

async function uploadFile(
    buffer,
    contentType,
    options
  ){
    try {
      const client = new aws.S3();

      const idUpload = uuidv4();
      const params = {
        Bucket: options?.bucket ? options.bucket : 'uploads',
        Key: options?.key ? options.key : idUpload,
        Body: buffer,
        ContentType: contentType,
        ACL: options?.acl,
      };
      return await client.upload(params).promise();
    } catch (error) {
      logger.error(error);
      return error;
    }
  }