const Property = require('../Models/PropertyModel');
const asyncHandler = require('express-async-handler');

exports.getAllProperties = asyncHandler(async (req, res) => {
    const properties = await Property.find();
    res.status(200).json(properties);
});

exports.getProperty = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (property) {
        res.status(200).json(property);
    } else {
        res.status(404).json({ message: 'Property not found' });
    }
});

exports.createProperty = asyncHandler(async (req, res) => {
    const property = new Property({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        location: req.body.location,
        owner: req.body.owner,
        image: req.body.image,
        status: req.body.status
    });
    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
});

exports.updateProperty = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (property) {
        property.title = req.body.title || property.title;
        property.description = req.body.description || property.description;
        property.price = req.body.price || property.price;
        property.location = req.body.location || property.location;
        property.image = req.body.image || property.image;
        property.status = req.body.status || property.status;

        const updatedProperty = await property.save();
        res.status(200).json(updatedProperty);
    } else {
        res.status(404).json({ message: 'Property not found' });
    }
});

exports.deleteProperty = asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (property) {
        await property.remove();
        res.status(200).json({ message: 'Property deleted' });
    } else {
        res.status(404).json({ message: 'Property not found' });
    }
});

