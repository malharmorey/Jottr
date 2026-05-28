import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
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
app.set('trust proxy', 1);
const port = process.env.PORT || 8080;

//Middleware function
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '18kb' }));
app.use(cors({ origin: (origin, cb) => cb(null, origin === process.env.CLIENT_ORIGIN) }));

// Available Routes
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);

app.get('/', (req, res) => {
	res.status(200).send('Welcome to server!');
});

app.use((err, req, res, next) => {
	if (err.type === 'entity.too.large') {
		return res.status(413).json({ success: false, message: 'Request too large' });
	}
	next(err);
});

app.listen(port, () => {
	console.log(`CloudBook server listening on port ${port}`);
});
