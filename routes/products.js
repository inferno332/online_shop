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

const collectionName = 'products';

// Query
const queries = [
    // Hiển thị tất cả các mặt hàng có giảm giá <= 10%
    { discount: { $lte: 10 } },
    // Hiển thị tất cả các mặt hàng có tồn kho <= 5
    { stock: { $lte: 5 } },
];

//Hiển thị tất cả các mặt hàng có Giá bán sau khi đã giảm giá <= 100.000
const discountedPriceLte1000 = [
    {
        $project: {
            name: 1,
            price: 1,
            discount: 1,
            stock: 1,
            discountedPriceLte1000: {
                $subtract: [
                    '$price',
                    {
                        $multiply: [
                            '$price',
                            {
                                $divide: ['$discount', 100],
                            },
                        ],
                    },
                ],
            },
        },
    },
    {
        $match: {
            discountedPrice: {
                $lte: 1000,
            },
        },
    },
];

const lookup = [
    {
        $lookup: {
            from: 'categories', // foreign collection name
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category', // alias
        },
    },
    {
        $lookup: {
            from: 'suppliers',
            localField: 'supplierId',
            foreignField: '_id',
            as: 'supplier',
        },
    },
];

// Get all
router.get('/', async (req, res) => {
    try {
        const result = await findDocuments({aggregate: lookup}, collectionName);
        res.status(200).json(result);
    } catch (err) {
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
