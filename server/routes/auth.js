import express from 'express';
import User from '../models/User.js';
import { body } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { formatMaxLengthError, validate } from '../lib/validation.js';

const router = express.Router();

const JWT_SECRET = `${process.env.JWT_SECRET_KEY}`;

const buildAuthLimiter = ({ windowMs, limit, message, skipSuccessfulRequests, skipFailedRequests }) =>
	rateLimit({
		windowMs,
		limit,
		skipSuccessfulRequests,
		skipFailedRequests,
		standardHeaders: 'draft-7',
		legacyHeaders: false,
		handler: (req, res) => {
			res.status(429).json({ success: false, message });
		},
	});

const signupLimiter = buildAuthLimiter({
	windowMs: 24 * 60 * 60 * 1000,
	limit: 5,
	skipFailedRequests: true,
	message: 'Daily signup limit reached, try again tomorrow',
});

const loginLimiter = buildAuthLimiter({
	windowMs: 15 * 60 * 1000,
	limit: 5,
	skipSuccessfulRequests: true,
	message: 'Too many failed attempts, try again in 15 minutes',
});

//---------------------------------ROUTE 1---------------------------------
// Creating a user using : POST "api/auth/createUser". No login required
router.post(
	'/createUser',
	signupLimiter,
	[
		//Validating the input from user
		body('name')
			.isLength({
				min: 4,
			})
			.withMessage('Name should contain at least 4 characters'),
		body('email').isEmail().withMessage('Enter a valid email'),
		body('password')
			.isLength({
				min: 5,
			})
			.withMessage('Password length must be minimum 5 characters')
			.isStrongPassword()
			.withMessage(
				'Password must contain at least 1 lowerCase, 1 upperCase, 1 number and 1 symbol'
			),
	],
	validate,
	async (req, res) => {
		//Checking if user with same email already exist
		try {
			let user = await User.findOne({ email: req.body.email });
			if (user) {
				return res.status(400).json({
					success: false,
					message: 'Email already in use, Please use different Email',
				});
			}
			if (Buffer.byteLength(req.body.password, 'utf8') > 72) {
				return res.status(400).json({
					success: false,
					message: 'Password must be 72 characters or fewer',
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
					name: user.name,
				},
			};
			const authToken = jwt.sign(data, JWT_SECRET, { algorithm: 'HS256' });
			res.json({ success: true, authToken, message: 'User added successfully' });
		} catch (error) {
			if (error.name === 'ValidationError') {
				const msg = formatMaxLengthError(error);
				if (msg) return res.status(400).json({ success: false, message: msg });
			}
			res.status(500).json({ success: false, message: 'Internal server error' });
		}
	}
);

//----------------------------------ROUTE 2---------------------------------
// Authenticating a user using : POST "api/auth/login". No login required
router.post(
	'/login',
	loginLimiter,
	[
		//Validating the input from user
		body('email').isEmail().withMessage('Enter a valid email'),
		body('password').exists().withMessage('Password can not be blank'),
	],
	validate,
	async (req, res) => {
		const { email, password } = req.body;
		try {
			let user = await User.findOne({ email });
			if (!user) {
				return res.status(400).json({
					success: false,
					message: `We couldn't find an account matching the login info you entered`,
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
					name: user.name,
				},
			};
			const authToken = jwt.sign(data, JWT_SECRET, { algorithm: 'HS256' });
			res.json({ success: true, authToken });
		} catch (error) {
			res.status(500).json({ success: false, message: 'Internal server error' });
		}
	}
);

export default router;
