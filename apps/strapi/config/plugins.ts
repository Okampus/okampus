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
});
