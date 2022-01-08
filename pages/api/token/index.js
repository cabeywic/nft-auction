const tokens = require('../../../src/data/tokens.json');

export default function handler(req, res) {
    res.send(tokens);
}