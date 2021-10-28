const express = require('express');
const router = new express.Router(); // initializing router application, similar to express application
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const {
	sendWelcomeEmail,
	sendCancellationEmail,
} = require('../emails/account');

const upload = multer({
	// dest: './images',
	limits: {
		fileSize: 1000000, //size in bytes
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error('Please Upload a valid image file!!'));
		}

		cb(undefined, true);
	},
});

// CREATE USER
router.post('/users/signup', async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		sendWelcomeEmail(user.email, user.name); //no need to use await for this async operation bcoz it may be sent in a minute or two. We dont want to wait that long to send 200 status.
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (e) {
		res.status(400).send(e);
		// console.log(e);
	}
});

// USER LOGIN
router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (e) {
		res.status(400).send(e.toString());
		// console.log(e);
	}
});

// READ PROFILE
router.get('/users/me', auth, async (req, res) => {
	res.send(req.user);
});

// LOGOUT USER
router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter(
			(token) => token.token !== req.token
		);
		await req.user.save();
		res.send(req.user.name + ' logged out successfully');
	} catch (e) {
		res.status(500).send();
		// console.log(e);
	}
});

// LOGOUT FROM ALL DEVICES
router.post('/users/logoutall', auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send(req.user.name + ' logged out of all devices successfully');
	} catch (e) {
		res.status(500).send();
	}
});

// UPDATE USER PROFILE
router.patch('/users/me', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'age', 'email', 'password'];
	const isValid = updates.every((key) => allowedUpdates.includes(key));
	if (!isValid) return res.status(400).send({ error: 'Invalid updates!' });

	try {
		// const user = await User.findByIdAndUpdate(req.params.id, req.body, {          // This was bypassing mongoose middleware...
		//     new: true,
		//     runValidators: true,
		// });

		// const user = await User.findById(req.params.id);

		// if (!user) return res.status(404).send();

		updates.forEach((update) => (req.user[update] = req.body[update]));
		await req.user.save();
		res.send(req.user);
	} catch (e) {
		res.status(400).send(e);
		// console.log(e);
	}
});

// DELETE USER PROFILE
router.delete('/users/me', auth, async (req, res) => {
	try {
		// await User.findByIdAndDelete(req.user._id);
		sendCancellationEmail(req.user.email, req.user.name);
		req.user.remove();
		res.send(req.user);
	} catch (e) {
		res.status(500).send();
	}
});

//...................................PROFILE PICRURE......................................................

// SET PROFILE PICTURE
router.post(
	'/users/me/avatar',
	auth,
	upload.single('avatar'),
	async (req, res) => {
		const buffer = await sharp(req.file.buffer)
			.resize({ height: 200, width: 200 })
			.png()
			.toBuffer();
		req.user.avatar = buffer;
		await req.user.save();
		res.send('dp saved');
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
		console.log(error);
	}
);

// DELETE PROFILE PICTURE
router.delete('/users/me/avatar', auth, async (req, res) => {
	req.user.avatar = undefined;
	console.log(req.user);
	await req.user.save();
	res.send('Profile picture deleted!');
});

//GET PROFILE PICTURE
router.get('/users/:id/avatar', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user || !user.avatar) {
			throw new Error();
		}
		res.set('Content-Type', 'image/jpg');
		res.send(user.avatar);
	} catch (e) {
		res.status(404).send(e);
	}
});

module.exports = router;
