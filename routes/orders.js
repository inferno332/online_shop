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

// ============== QUERIES =============== //
// Hiển thị tất cả các đơn hàng có trạng thái là COMPLETED
router.get('/question/7', async (req, res) => {
    try {
        const result = await findDocuments({ query: { status: 'COMPLETED' } }, collectionName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Hiển thị tất cả các đơn hàng có trạng thái là COMPLETED trong ngày hôm nay
router.get('/question/8', async (req, res) => {
    const completedToday = {
        $expr: {
            $and: [
                { $eq: ['$status', 'COMPLETED'] },
                { $eq: [{ $dayOfMonth: '$shippedDate' }, { $dayOfMonth: new Date() }] },
                { $eq: [{ $month: '$shippedDate' }, { $month: new Date() }] },
                { $eq: [{ $year: '$shippedDate' }, { $year: new Date() }] },
            ],
        },
    };
    try {
        const result = await findDocuments({ query: completedToday }, collectionName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Hiển thị tất cả các đơn hàng có trạng thái là CANCELED
router.get('/question/9', async (req, res) => {
    try {
        const result = await findDocuments({ query: { status: 'CANCELED' } }, collectionName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Hiển thị tất cả các đơn hàng có trạng thái là CANCELED trong ngày hôm nay
router.get('/question/10', async (req, res) => {
    const canceledToday = {
        $expr: {
            $and: [
                { $eq: ['$status', 'CANCELED'] },
                { $eq: [{ $dayOfMonth: '$shippedDate' }, { $dayOfMonth: new Date() }] },
                { $eq: [{ $month: '$shippedDate' }, { $month: new Date() }] },
                { $eq: [{ $year: '$shippedDate' }, { $year: new Date() }] },
            ],
        },
    };
    try {
        const result = await findDocuments({ query: canceledToday }, collectionName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Hiển thị tất cả các đơn hàng có hình thức thanh toán là CASH
router.get('/question/11', async (req, res) => {
    try {
        const result = await findDocuments({ query: { paymentType: 'CASH' } }, collectionName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Hiển thị tất cả các đơn hàng có hình thức thanh toán là CREADIT CARD
router.get('/question/12', async (req, res) => {
    try {
        const result = await findDocuments({ query: { paymentType: 'CREDIT CARD' } }, collectionName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Hiển thị tất cả các đơn hàng có hình thức thanh toán là CREADIT CARD
router.get('/question/13', async (req, res) => {
    try {
        const result = await findDocuments({ query: { shippingCity: 'Hà Nội' } }, collectionName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Hiển thị tất cả các mặt hàng được bán trong khoảng từ ngày, đến ngày
router.get('/question/20', async (req, res) => {
    const agg = [
        {
            $match: {
                $expr: {
                    $and: [
                        { $eq: ['$status', 'COMPLETED'] },
                        { $eq: [{ $dayOfMonth: '$shippedDate' }, { $dayOfMonth: new Date() }] },
                        { $eq: [{ $month: '$shippedDate' }, { $month: new Date() }] },
                        { $eq: [{ $year: '$shippedDate' }, { $year: new Date() }] },
                    ],
                },
            },
        },
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
            $project: { products: 1, _id: 0 },
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
