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
const { validateSchema, categorySchema } = require('../validation/schemas.yup');

const collectionName = 'categories';
// ============== QUERIES =============== //
// Hiển thị tất cả danh mục (Categories) với số lượng hàng hóa trong mỗi danh mục

router.get('/question/18', async (req, res) => {
    const aggregate = [
        {
            $lookup: {
                from: 'products',
                let: { id: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$$id', '$categoryId'] },
                        },
                    },
                ],
                as: 'products',
            },
        },
        {
            $addFields: {numberOfProducts: {$size: '$products'}}
        }
    ];
    try {
        const result = await findDocuments({aggregate: aggregate}, collectionName);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// ============END OF QUERIES============= //


// Search by name
router.get('/search/name',validateSchema(categorySchema), async (req, res) => {
    try {
        const { text } = req.query;
        const query = { name: new RegExp(`^${text}`) };
        const result = await findDocuments({query: query}, collectionName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search by id
router.get('/search/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await findDocuments({query: id}, collectionName);
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
