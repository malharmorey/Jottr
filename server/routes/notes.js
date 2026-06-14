import express from 'express';
import Note from '../models/Note.js';
import fetchuser from '../middleware/fetchuser.js';
import { body } from 'express-validator';
import { formatMaxLengthError, validate } from '../lib/validation.js';
import rateLimit from 'express-rate-limit';
import { reserveSummary, refundSummary } from '../lib/quota.js';
import summarizeNote from '../lib/summarize.js';

const router = express.Router();

const summarizeLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 20,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	handler: (req, res) => {
		res.status(429).json({ success: false, message: 'Too many summary requests, try again later' });
	},
});

//---------------------------------ROUTE 1---------------------------------
// fetching all notes of a user : get "api/notes/getallnotes".Login required
router.get('/getallnotes', fetchuser, async (req, res) => {
	try {
		const notes = await Note.find({ user: req.user.id });
		res.json({ success: true, notes });
	} catch (error) {
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
});

//---------------------------------ROUTE 2---------------------------------
// Adding note of a user : POST "api/notes/addnote".Login required
router.post(
	'/addnote',
	fetchuser,
	[
		// Validating the input from user
		body('title')
			.isLength({
				min: 3,
			})
			.withMessage('Title should contain atleast 3 characters'),
		body('description')
			.exists({ checkFalsy: true })
			.withMessage('Description can not be blank')
			.isLength({ min: 5 })
			.withMessage('Description must contain atleast 5 characters'),
	],
	validate,
	async (req, res) => {
		const { title, description, tag } = req.body;
		try {
			// Creating a new note
			const note = new Note({
				title,
				description,
				tag,
				user: req.user.id,
				date: Date.now(),
			});
			await note.save();
			res.json({
				success: true,
				note: note,
				message: 'Your note has been added successfully',
			});
		} catch (error) {
			if (error.name === 'ValidationError') {
				const msg = formatMaxLengthError(error);
				if (msg) return res.status(400).json({ success: false, message: msg });
			}
			res.status(500).json({ success: false, message: 'Internal server error' });
		}
	}
);

//---------------------------------ROUTE 3---------------------------------
// Updating an existing note of a user : PUT "api/notes/updatenote".Login required
router.put(
	'/updatenote/:id',
	fetchuser,
	[
		// Validating the input from user
		body('title')
			.isLength({
				min: 3,
			})
			.withMessage('Title should contain atleast 3 characters'),
		body('description')
			.exists({ checkFalsy: true })
			.withMessage('Description can not be blank')
			.isLength({ min: 5 })
			.withMessage('Description must contain atleast 5 characters'),
	],
	validate,
	async (req, res) => {
		const { title, description, tag } = req.body;
		try {
			// Creating a new note object
			const newNote = {};
			if (title) {
				newNote.title = title;
				newNote.date = Date.now();
			}
			if (description) {
				newNote.description = description;
			}
			if (tag) {
				newNote.tag = tag;
			}

			// Finding the note to be updated
			let note = await Note.findById(req.params.id);
			if (!note) {
				return res.status(404).json({ success: false, message: 'Note not found' });
			}
			// Allowing updation only if the user is authorized
			if (note.user.toString() !== req.user.id) {
				return res.status(401).json({ success: false, message: 'Unauthorized user' });
			}

			// Updating note
			note = await Note.findByIdAndUpdate(
				req.params.id,
				{ $set: newNote },
				{ new: true }
			);
			res.json({
				success: true,
				message: ' Your note has been updated successfully',
				date: Date.now(),
			});
		} catch (error) {
			if (error.name === 'ValidationError') {
				const msg = formatMaxLengthError(error);
				if (msg) return res.status(400).json({ success: false, message: msg });
			}
			res.status(500).json({ success: false, message: 'Internal server error' });
		}
	}
);

//---------------------------------ROUTE 4---------------------------------
// Deleting an existing note of a user : DELETE "api/notes/deletenote".Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
	try {
		// Finding the note to be deleted
		let note = await Note.findById(req.params.id);
		if (!note) {
			return res.status(404).json({ success: false, message: 'Note not found' });
		}

		// Allowing deletion only if the user is authorized
		if (note.user.toString() !== req.user.id) {
			return res.status(401).json({ success: false, message: 'Unauthorized user' });
		}

		// Updating note
		note = await Note.findByIdAndDelete(req.params.id);
		res.json({ success: true, message: 'Your note has been deleted successfully' });
	} catch (error) {
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
});

//---------------------------------ROUTE 5---------------------------------
// Summarizing a user's note via the AI helper : POST "api/notes/summarize/:id".Login required
router.post('/summarize/:id', summarizeLimiter, fetchuser, async (req, res) => {
	try {
		const note = await Note.findById(req.params.id);
		// 404 for both "not found" and "not yours" — no existence leak
		if (!note || note.user.toString() !== req.user.id) {
			return res.status(404).json({ success: false, message: 'Note not found' });
		}

		const reserved = await reserveSummary(req.user.id);
		if (!reserved) {
			return res
				.status(429)
				.json({ success: false, message: 'Daily summary limit reached, try again tomorrow' });
		}

		try {
			const summary = await summarizeNote(note);
			res.json({ success: true, summary });
		} catch (error) {
			await refundSummary(req.user.id);
			res
				.status(502)
				.json({ success: false, message: 'Could not generate a summary, please try again' });
		}
	} catch (error) {
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
});

export default router;
