import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

if (
  !process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ||
  !process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ||
  !process.env.NEXT_PUBLIC_AWS_REGION ||
  !process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME
) {
  throw new Error("AWS credentials not configured");
}

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadImage(file: File, folder: string): Promise<string> {
  const buffer = await file.arrayBuffer();
  const key = `${folder}/${Date.now()}-${file.name}`;

  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: key,
    Body: new Uint8Array(buffer),
    ContentType: file.type,
  });

  await s3Client.send(command);
  return key;
}

export async function getImageUrl(key: string): Promise<string> {
  // If the key is already a full URL, return it as is
  if (key.startsWith("http")) {
    return key;
  }

  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
}
