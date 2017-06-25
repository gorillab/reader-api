require('dotenv').config();

export const db = {
	debug: process.env.NODE_ENV !== 'production',
	mongodb: {
	    url: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?reconnectTries=10&reconnectInterval=3000`
	}
};
