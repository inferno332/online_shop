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

const collectionName = 'suppliers';

// ============== QUERIES =============== //
// Hiển thị tất cả nhà cung cấp (Suppliers) với số lượng hàng hóa mỗi nhà cung cấp
router.get('/question/19', async (req, res) => {
    const agg = [
        {
            $lookup: {
                from: 'products',
                let: { id: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$$id', '$supplierId'] },
                        },
                    },
                ],
                as: 'products',
            },
        },
        {
            $addFields: { numberOfProducts: { $size: '$products' } },
        },
    ];
    try {
        const result = await findDocuments({ aggregate: agg }, collectionName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============END OF QUERIES============= //

router.get('/', async (req, res) => {
    try {
        const result = await findDocuments({}, collectionName);
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
        const query = { name: new RegExp(`^${text}`) };
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
