const tokens = require('../../../src/data/tokens.json');

export default function handler(req, res) {
    const { tokenId } = req.query;

    try {
        if (!Number.isInteger(parseInt(tokenId))) throw new Error('ID must be an integer');
        if (tokenId > tokens.length) throw new Error('Invalid token');

        let token = tokens[tokenId];
        return res.send(token);
    } catch(err) {
        return res.status(400).send({
            message: err.message
        });
    }

}