export const session = {
    collection: 'sessions',
    name: require('../app.json').name,
    secret: process.env.SESSION_SECRET || require('../app.json').name,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 86400000    // 1 hour
    },
    resave: false,  //don't save session if unmodified
    saveUninitialized: true, // don't create session until something stored
    rolling: true   //Force a cookie to be set on every response. This resets the expiration date.
};
