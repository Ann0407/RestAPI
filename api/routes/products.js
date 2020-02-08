const express = require('express');
const router = express.Router();
const Validate = require('jsonschema').Validator;
const redis = require('redis');
const client = redis.createClient({
    port: 16981,
    host: 'redis-16981.c16.us-east-1-3.ec2.cloud.redislabs.com',
    password: 'Change@001'
});

const Product = require('../models/product.js');
const v = new Validate();
client.on('connect', function () {
    console.log('redis connected');
});

router.post('/', (req, res, next) => {
    const data = req.body;
    console.log(v.validate(data, Product));
    const obj1 = data.itme6;
    client.hmset('itme6', 'name', obj1['name'], 'price', obj1['price']);
    res.status(200).json({
        message: "Add new key to Redis!" 
    })
});

router.get('/:item', (req, res, next) => {
    const name = req.params.item;
    client.hgetall(name, function(err, object) {
        console.log(object);
        res.json(object);
        if (err) {
            res.json({
                error: err
            })
        }
    })
    
});

router.delete('/:item', (req, res, next) => {
    const item = req.params.item;
    client.del(item, function(err, reply) {
        console.log(reply);
        res.status(200).json({
            message: "Delete key " + item + " from redis database!"
        })
        if (err) {
            res.status(500).json({
                error: err
            })
        }
    });
});

module.exports = router;