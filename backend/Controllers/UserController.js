//user Controller for Home rental system
const User = require('../Models/UserModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const asyncHandler = require('express-async-handler');
// Register a new User
exports.register = asyncHandler(async (req, res) => {
  const { name, email
    , password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ msg: 'User already exists' });

    }
    user = new User({
        name,
        email,
        password
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
const payload = {
        user: {
            id: user.id
        }
}
jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
}
    );
});
// Login User
exports.login = asyncHandler(async (req, res) => {
    const { email, password } =
        req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err,token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    });
    //Logout User
    exports.logout = asyncHandler(async (req, res) => {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        }
        );
        res.status(200).json({ msg: 'Logged out' });
    });
    //Get User Data
    exports.getUser = asyncHandler(async (req, res) => {
        const user = await User.findById(req.user.id);
        res.json({
            name: user.name,
            email: user.email,
            id: user.id,
            isAdmin: user.isAdmin,
        });
    });
    //Get All Users
    exports.getUsers = asyncHandler(async (req, res) => {
        const users = await User.find({});
        res.json(users);
    });
    //Update User
    exports.updateUser = asyncHandler(async (req, res) => {
        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
        }
        const user = await User.findByIdAndUpdate(req.params.id, {
            $set: { Username: req.body.Username,
                Email: req.body.Email,
                Password: req.body.Password,
                isAdmin: req.body.isAdmin,
            }
        }
        );
        res.status(200).json({ msg: 'Updated Successfully' });
    });
    //Delete User
    exports.deleteUser = asyncHandler(async (req, res) => {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: 'Deleted Successfully' });
    });
    //Get User Count
    exports.getUserCount = asyncHandler(async (req, res) => {
        const userCount = await User.countDocuments({});
        res.json(userCount);
    });
    //Get User Sales
    exports.getUserSales = asyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        let sales = 0;
        user.orders.forEach((order) => {
            sales += order.amount;
        }
        );
        res.json(sales);
    });
    