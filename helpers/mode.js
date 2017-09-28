const isDevelopment = () => process.env.NODE_ENV !== 'mock' && process.env.NODE_ENV !== 'production';

const isMock = () => process.env.NODE_ENV === 'mock';

const isProduction = () => process.env.NODE_ENV === 'production';

export {
  isDevelopment,
  isMock,
  isProduction,
};
