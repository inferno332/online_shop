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

const collectionName = 'orders';

// Get all
router.get('/', async (req, res) => {
    const aggregate = [
        {
            $lookup: {
                from: 'products',
                localField: 'orderDetails.productId',
                foreignField: '_id',
                as: 'products',
            },
        },
        {
            $unwind: {
                path: '$products',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'products.categoryId',
                foreignField: '_id',
                as: 'products.category',
            },
        },
        {
            $lookup: {
                from: 'suppliers',
                localField: 'products.supplierId',
                foreignField: '_id',
                as: 'products.supplier',
            },
        },
        {
            $group: {
                _id: '$_id',
                code: { $first: '$code' },
                products: {
                    $push: {
                        product: {
                            _id: '$products._id',
                            name: '$products.name',
                            price: '$products.price',
                            category: { $first: '$products.category' },
                            supplier: { $first: '$products.supplier' },
                        },
                        quantity: {
                            $getField: {
                                field: 'quantity',
                                input: {
                                    $first: {
                                        $filter: {
                                            input: '$orderDetails',
                                            as: 'od',
                                            cond: { $eq: ['$$od.productId', '$products._id'] },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    ];
    try {
        const result = await findDocuments({ aggregate: aggregate }, collectionName);
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
