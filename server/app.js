import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRouter from './routes/auth.js';
import notesRouter from './routes/notes.js';

const app = express();
app.set('trust proxy', 1);

//Middleware function
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '18kb' }));
app.use(cors({ origin: (origin, cb) => cb(null, origin === process.env.CLIENT_ORIGIN) }));

// Available Routes
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);

app.get('/', (_req, res) => {
	res.status(200).send('Welcome to server!');
});

app.use((err, _req, res, next) => {
	if (err.type === 'entity.too.large') {
		return res.status(413).json({ success: false, message: 'Request too large' });
	}
	next(err);
});

export default app;
