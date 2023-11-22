import { CreateBucketCommand, ListBucketsCommand, PutBucketPolicyCommand, S3Client } from '@aws-sdk/client-s3';
import debug from 'debug';

const debugLog = debug('okampus:s3:init');
debug.enable('okampus:s3:init');

const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const forcePathStyle = process.env.NEXT_PUBLIC_S3_FORCE_PATH_STYLE === 'true';
const region = process.env.S3_REGION;
const endpoint =
  process.env.NEXT_PUBLIC_S3_LOCAL === 'true'
    ? `http://${process.env.NEXT_PUBLIC_S3_ENDPOINT}`
    : `https://${process.env.NEXT_PUBLIC_S3_ENDPOINT}`;

if (!accessKeyId) throw new Error('Missing S3_ACCESS_KEY_ID');
if (!secretAccessKey) throw new Error('Missing S3_SECRET_ACCESS_KEY');
if (!region) throw new Error('Missing S3_REGION');
if (!endpoint) throw new Error('Missing S3_ENDPOINT');

const bucketNames = Object.entries(process.env)
  .filter(([key]) => key.startsWith('NEXT_PUBLIC_S3_BUCKET_NAME_'))
  .map(([, value]) => value);

const s3Client = new S3Client({ credentials: { accessKeyId, secretAccessKey }, forcePathStyle, region, endpoint });

let currentBuckets = [];
try {
  currentBuckets = await s3Client.send(new ListBucketsCommand({}));
} catch (err) {
  debugLog('Error: Unable to connect to the S3 instance');

  debugLog('Access key ID:', accessKeyId);
  debugLog('Secret access key:', secretAccessKey.slice(0, 4), '...');
  debugLog('Region:', region);
  debugLog('Endpoint:', endpoint);
  debugLog('Force path style:', forcePathStyle);

  throw err;
}

for (const bucketName of bucketNames) {
  if (currentBuckets.Buckets?.some((bucket) => bucket.Name === bucketName)) {
    debugLog(`Bucket "${bucketName}" already exists`);
    continue;
  }

  debugLog(`Creating bucket "${bucketName}"`);
  await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
  await s3Client.send(
    new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetBucketLocation', 's3:ListBucket'],
            Resource: [`arn:aws:s3:::${bucketName}`],
          },
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${bucketName}/*`],
          },
        ],
      }),
    }),
  );
}

debugLog('\nDone!');
