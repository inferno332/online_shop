const yup = require('yup');

const validateSchema = (schema) => async (req, res, next) => {
    try {
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    } catch (err) {
        return res.status(400).json({ type: err.name, message: err.message });
    }
};

const categorySchema = yup.object({
    body: yup.object({
        name: yup.string(),
    }),
    query: yup.object({
        text : yup.string().required()
    })
});

const supplierSchema = yup.object({
    body: yup.object({
        name: yup.string().required(),
        phone: yup.string().required(),
    }),
});

const productSchema = yup.object({
    body: yup.object({
        name: yup.string().required(),
        price: yup.number().min(0).required(),
    }),
});

module.exports = {
    validateSchema,
    categorySchema,
    supplierSchema,
    productSchema,
};
