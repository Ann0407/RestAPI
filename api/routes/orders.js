const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(201).json({
        message:'Get requests to orders'
    });
});

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    };
    res.status(201).json({
        message:'order was created',
        order: order
    });
});

router.get('/:orderId', (req, res, next) => {
    res.status(201).json({
        message:'order details',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(201).json({
        message:'order delete',
        orderId: req.params.orderId
    });
});

module.exports = router;