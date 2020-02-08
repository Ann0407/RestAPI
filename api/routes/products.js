const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient({
    port: 16981,
    host: 'redis-16981.c16.us-east-1-3.ec2.cloud.redislabs.com',
    password: 'Change@001'
});

const Product = require('../models/product');

client.on('connect', function () {
    console.log('redis connected');
});

router.get('/', (req, res, next) => {
    Product.find()
    .exec()
    .then( docs => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
});

router.post('/', (req, res, next) => {
    client.set("name", req.body.name, redis.print)
    client.get('name', function(error, result) {
        if (error) throw error;
        console.log('Get result->' + result)
    });
    console.log(req.body.name);
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.prodcutId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log('From database', doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({message: 'No valid entry found for privided ID'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        });
    
});

// change data in the database
router.patch('/:productId', (req, res, next) => {
    const id = req.params.prodcutId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id}, {$set: updateOps })
    .exec()
    .then( result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.prodcutId;
    Product.remove({ _id: id})
    .exec()
    .then( result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;