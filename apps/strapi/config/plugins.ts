export default ({ env }) => ({
  'fuzzy-search': {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: 'api::feedback.feedback',
          modelName: 'feedbacks',
          queryConstraints: {
            where: {
              $and: [
                { publishedAt: { $notNull: true } },
              ],
            },
          },
          fuzzysortOptions: {
            characterLimit: 300,
            threshold: -600,
            limit: 10,
            keys: [
              { name: 'type', weight: 100 },
              { name: 'message', weight: 100 },
            ],
          },
        },
      ],
    },
  },

  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('S3_ACCESS_KEY_ID'),
        secretAccessKey: env('S3_SECRET_ACCESS_KEY'),
        endpoint: env('S3_ENDPOINT'),
        params: {
          Bucket: env('S3_BUCKET_NAME_STRAPI'),
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
