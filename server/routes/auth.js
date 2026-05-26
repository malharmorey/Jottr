import express from 'express';
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import fetchuser from '../middleware/fetchuser.js';

const router = express.Router();

const JWT_SECRET = `${process.env.JWT_SECRET_KEY}`;

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 5,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	handler: (req, res) => {
		res.status(429).json({ success: false, message: 'Too many attempts, try again in 15 minutes' });
	},
});

//---------------------------------ROUTE 1---------------------------------
// Creating a user using : POST "api/auth/createUser". No login required
router.post(
	'/createUser',
	authLimiter,
	[
		//Validating the input from user
		body('name')
			.isLength({
				min: 4,
			})
			.withMessage('Name should contain atleast 4 characters'),
		body('email').isEmail().withMessage('Enter a valid email'),
		body('password')
			.isLength({
				min: 5,
			})
			.withMessage('Password lenght must be minimum 5 characters')
			.isStrongPassword()
			.withMessage(
				'Password must contain atleast 1 lowerCase, 1 upperCase, 1 number and 1 symbol '
			),
	],
	async (req, res) => {
		// Returning bad request and error in case of any error

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}
		//Checking if user with same email already exist
		try {
			let user = await User.findOne({ email: req.body.email });
			if (user) {
				return res.status(400).json({
					success: false,
					message: 'Email already in use, Please use different Email',
				});
			}
			//Hashing the new user password before storing it to our DB
			const salt = await bcrypt.genSalt(10);
			const encryptedPassword = await bcrypt.hash(req.body.password, salt);
			//Creating a new user
			user = await User.create({
				name: req.body.name,
				email: req.body.email,
				password: encryptedPassword,
			});
			//Sending signed Auth-Token as a response
			const data = {
				user: {
					id: user.id,
				},
			};
			const authToken = jwt.sign(data, JWT_SECRET, { algorithm: 'HS256' });
			res.json({ success: true, authToken, message: 'User added successfully' });
		} catch (error) {
			res.status(500).json({ success: false, message: 'Internal server error' });
		}
	}
);

//----------------------------------ROUTE 2---------------------------------
// Authenticating a user using : POST "api/auth/login". No login required
router.post(
	'/login',
	authLimiter,
	[
		//Validating the input from user
		body('email').isEmail().withMessage('Enter a valid email'),
		body('password').exists().withMessage('Password can not be blank'),
	],
	async (req, res) => {
		// Returning bad request and error in case of any error
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}

		const { email, password } = req.body;
		try {
			let user = await User.findOne({ email });
			if (!user) {
				return res.status(400).json({
					success: false,
					message: `We couldn't find an account matching the login info you entered  `,
				});
			}
			//Verifying the user password input
			const comparePassword = await bcrypt.compare(password, user.password);
			if (!comparePassword) {
				return res.status(400).json({
					success: false,
					message: `Incorrect password`,
				});
			}
			//Sending signed Auth-Token as a response
			const data = {
				user: {
					id: user.id,
				},
			};
			const authToken = jwt.sign(data, JWT_SECRET, { algorithm: 'HS256' });
			res.json({ success: true, authToken });
		} catch (error) {
			res.status(500).json({ success: false, message: 'Internal server error' });
		}
	}
);

//----------------------------------ROUTE 3---------------------------------
// Fetching a user using : POST "api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
	try {
		const userId = req.user.id;
		const user = await User.findById(userId).select('-password');
		res.send(user);
	} catch (error) {
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
});
export default router;
