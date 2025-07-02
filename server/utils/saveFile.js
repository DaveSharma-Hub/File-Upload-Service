import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs/promises";
import { isProduction } from "./common.js";

const bucket = process.env.S3_BUCKET || "fileuploadbucket";
const aws_region = process.env.AWS_REGION || 'us-east-1';

const saveFileS3 = async ({ client, fileName, fileData, mimeType }) => {
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Body: fileData,
      Key: fileName,
      Metadata: {
        mimeType,
        fileName,
      },
      ChecksumAlgorithm: "SHA256",
    })
  );
};

const saveFileLocally = async ({ fileName, fileData }) => {
  await fs.writeFile(`./statics/${fileName}`, fileData);
};

export const saveFile =
  (s3Client) =>
  async ({ fileName, fileData, mimeType }) => {
    const fileType = mimeType?.split("/")?.[1] || "txt";
    const filePathName = `${fileName}.${fileType}`;

    const fn = isProduction() ? saveFileS3 : saveFileLocally;
    await fn({
      client: s3Client,
      fileName: filePathName,
      fileData,
      mimeType,
    });

    const url = `${process.env.CLOUDFRONT_DISTRIBUTION}/${filePathName}`;
    // const url = `https://${bucket}.s3.${aws_region}.amazonaws.com/${filePathName}`;
    return url;
  };
