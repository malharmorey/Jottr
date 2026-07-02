import 'dotenv/config';
import connectToMongo from './db.js';
import app from './app.js';

const required = ['MONGO_USERNAME', 'MONGO_PASSWORD', 'MONGO_CLUSTER', 'MONGO_DBNAME', 'JWT_SECRET_KEY', 'CLIENT_ORIGIN', 'ANTHROPIC_API_KEY'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
	console.error(`Missing required env vars: ${missing.join(', ')}`);
	process.exit(1);
}

connectToMongo();
const port = process.env.PORT || 8080;

app.listen(port, () => {
	console.log(`Jottr app listening on port ${port}`);
});
