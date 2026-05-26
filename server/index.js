import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectToMongo from './db.js';
import authRouter from './routes/auth.js';
import notesRouter from './routes/notes.js';

const required = ['MONGO_USERNAME', 'MONGO_PASSWORD', 'MONGO_CLUSTER', 'MONGO_DBNAME', 'JWT_SECRET_KEY', 'CLIENT_ORIGIN'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
	console.error(`Missing required env vars: ${missing.join(', ')}`);
	process.exit(1);
}

connectToMongo();
const app = express();
const port = process.env.PORT || 8080;

//Middleware function
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));

// Available Routes
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);

app.get('/', (req, res) => {
	res.status(200).send('Welcome to server!');
});

app.listen(port, () => {
	console.log(`CloudBook server listening on port ${port}`);
});
