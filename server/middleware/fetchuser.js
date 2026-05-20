var jwt = require('jsonwebtoken');

const JWT_SECRET = `${process.env.JWT_SECRET_KEY}`;

// Fetching userId from auth-token send by user
const fetchuser = (req, res, next) => {
	let success = false;
	const token = req.header('auth-token');
	if (!token) {
		success = false;
		return res.status(401).send({ success, errors: 'Invalid Token' });
	}

	try {
		// Authenticating auth-token and fetching userId from it
		jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }, (err, userData) => {
			if (err) {
				success = false;
				return res.status(401).send({
					success,
					errors: 'User is not authenticated to perform this task',
				});
			} else {
				req.user = userData.user;
				next();
			}
		});
	} catch (error) {
		success = false;
		res.status(403).send({ success, errors: 'Invalid user' });
	}
};

module.exports = fetchuser;
