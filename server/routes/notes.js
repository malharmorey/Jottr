const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

let success;
//---------------------------------ROUTE 1---------------------------------
// fetching all notes of a user : get "api/notes/getallnotes".Login required
router.get('/getallnotes', fetchuser, async (req, res) => {
	try {
		const notes = await Note.find({ user: req.user.id });
		const user = await User.find({ _id: req.user.id });
		userName = user.map((user) => {
			return user.name;
		});
		success = true;
		res.json({ success, userName: userName, notes: notes });
	} catch (error) {
		success = false;
		res.status(500).json({ success, message: 'Internal server error' });
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
	async (req, res) => {
		// let success = false;
		const { title, description, tag } = req.body;
		try {
			// Returning bad request and error in case of any error
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				success = false;
				return res.status(400).json({ success, errors: errors.array() });
			}

			// Creating a new note
			const note = new Note({
				title,
				description,
				tag,
				user: req.user.id,
				date: Date.now(),
			});
			await note.save();
			success = true;
			res.json({
				success,
				note: note,
				message: 'Your note has been added successfully',
			});
		} catch (error) {
			success = false;
			res.status(500).json({ success, message: 'Internal server error' });
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
	async (req, res) => {
		const { title, description, tag } = req.body;
		// Returning bad request and error in case of any error
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			success = false;
			return res.status(400).json({ success, errors: errors.array() });
		}
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
				success = false;
				return res.status(404).json({ success, message: 'Note not found' });
			}
			// Allowing updation only if the user is authorized
			if (note.user.toString() !== req.user.id) {
				success = false;
				return res.status(401).json({ success, message: 'Unauthorized user' });
			}

			// Updating note
			note = await Note.findByIdAndUpdate(
				req.params.id,
				{ $set: newNote },
				{ new: true }
			);
			success = true;
			res.json({
				success,
				message: ' Your note has been updated successfully',
				date: Date.now(),
			});
		} catch (error) {
			success = false;
			res.status(500).json({ success, message: 'Internal server error' });
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
			success = false;
			return res.status(404).json({ success, message: 'Note not found' });
		}

		// Allowing deletion only if the user is authorized
		if (note.user.toString() !== req.user.id) {
			success = false;
			return res.status(401).json({ success, message: 'Unauthorized user' });
		}

		// Updating note
		note = await Note.findByIdAndDelete(req.params.id);
		success = true;
		res.json({ success, message: 'Your note has been deleted successfully' });
	} catch (error) {
		success = false;
		res.status(500).json({ success, message: 'Internal server error' });
	}
});
module.exports = router;
