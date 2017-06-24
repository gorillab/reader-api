const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || '27017';
const database = process.env.DB_NAME || 'reader-api-dev';

export const db = {
	debug: process.env.NODE_ENV !== 'production',
	mongodb: {
	    url: `mongodb://${host}:${port}/${database}?reconnectTries=10&reconnectInterval=3000`
	}
};
