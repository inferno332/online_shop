var express = require('express');
var router = express.Router();

const {
    insertDocument,
    insertDocuments,
    updateDocumentByID,
    deleteDocument,
    deleteDocuments,
    findDocument,
    findDocuments,
} = require('../mongodb/method');

const collectionName = 'categories';

router.get('/', (req, res) => {
    try {
        res.json({ ok: true });
    } catch (error) {
        res.sendStatus(error);
    }
});

router.get('/search', async (req, res) => {
    try {
        const data = await findDocuments({}, collectionName);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;