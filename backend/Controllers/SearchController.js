const { Home } = require('../Models/HomeModel');

const search = async (req, res) => {
    try {
        const { query, city, category } = req.query;
        const regex = new RegExp(query, 'i');
        const filter = {};
        if (city) filter.city = city;
        if (category) filter.category = category;
        const homes = await Home.find({ ...filter, $or: [{ title: regex }, { address: regex }] });
        res.json(homes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    search
}
