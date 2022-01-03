const routes = require('next-routes')();

routes
 .add('/auctions/new', '/auctions/new')
 .add('/auctions/:address', '/auctions/info');

module.exports = routes;