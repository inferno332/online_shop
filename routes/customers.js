var express = require('express');
var router = express.Router();

const {
    insertDocument,
    insertDocuments,
    updateDocumentByID,
    deleteDocument,
    deleteDocuments,
    changeDate,
    findDocuments,
} = require('../mongodb/method');

const collectionName = 'customers';

// Hiển thị tất cả các khách hàng có địa chỉ ở Quận Hải Châu
const query = { address: { $regex: /\b(\w*quận hải châu\w*)\b/ } };
//
const matchYear = [
    {
        $match: {
            $expr: {
                $and: [
                    { $eq: [{ $dayOfMonth: '$birthday' }, { $dayOfMonth: new Date() }] },
                    { $eq: [{ $month: '$birthday' }, { $month: new Date() }] },
                ],
            },
        },
    },
];

router.get('/', async (req, res) => {
    try {
        const result = await findDocuments({aggregate: matchYear}, collectionName);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Search by name
router.get('/search/name', async (req, res) => {
    try {
        const { text } = req.query;
        const query = { $or: [{ firstName: new RegExp(`^${text}`) }, { lastName: new RegExp(`^${text}`) }] };
        const result = await findDocuments(query, collectionName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search by id
router.get('/search/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await findDocuments(id, collectionName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/insert', async (req, res) => {
    try {
        const data = req.body;
        const result = await insertDocument(data, collectionName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/inserts', async (req, res) => {
    try {
        const data = req.body;
        const result = await insertDocuments(data, collectionName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update by id
router.patch('/update/:id', async (req, res) => {
    try {
        const data = req.body;
        const { id } = req.params;
        const result = await updateDocumentByID(id, data, collectionName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE by id
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteDocument(id, collectionName);
        res.status(200).json({ deletedId: id, result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
