export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '4bc59b1b184512c95693e481a52e6367'),
  },
});
