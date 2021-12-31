const routes = require('next-routes')();

routes
 .add('/auctions/:address', '/auctions/info');

module.exports = routes;