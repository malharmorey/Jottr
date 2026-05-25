import express from 'express';
import cors from 'cors';
import connectToMongo from './db.js';
import authRouter from './routes/auth.js';
import notesRouter from './routes/notes.js';

connectToMongo();
const app = express();
const port = process.env.PORT_NUMBER || 8080;

//Middleware function
app.use(express.json());
app.use(cors());

// Available Routes
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);

app.get('/', (req, res) => {
	res.status(200).send('Welcome to server!');
});

app.listen(port, () => {
	console.log(`CloudBook server listening on port ${port}`);
});
