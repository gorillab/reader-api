export const host = process.env.HOST;
export const port = process.env.PORT;
export const env = process.env.NODE_ENV;

export const session = {
    collection: 'sessions',
    name: process.env.APP_NAME,
    secret: process.env.SESSION_SECRET,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 86400000    // 1 hour
    },
    resave: false,  //don't save session if unmodified
    saveUninitialized: true, // don't create session until something stored
    rolling: true   //Force a cookie to be set on every response. This resets the expiration date.
}
