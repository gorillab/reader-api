const envs = ['development', 'production', 'test']

export const host = process.env.HOST || 'localhost';
export const port = process.env.PORT || '3000';
export const env = envs[0];
