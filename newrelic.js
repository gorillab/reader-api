// eslint-disable-next-line import/prefer-default-export
export const config = {
  app_name: [process.env.APP_NAME],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info',
  },
};
