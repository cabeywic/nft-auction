const { createServer } = require('http');
const next = require('next');
const routes = require('./routes');
const PORT = process.env.NODE_ENV || 3000;

const app = next({
    dev: process.env.NODE_ENV !== 'production'
})
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
    createServer(handler).listen(PORT, (err) => {
        if(err) throw err;

        console.log(`Ready on http://localhost:${PORT}`)
    })
});