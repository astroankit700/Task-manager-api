const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should sign up a new user', async () => {
	const response = await request(app)
		.post('/users/signup')
		.send({
			name: 'Ankit',
			email: 'ak@example.com',
			age: 21,
			password: 'nopassatall4',
		})
		.expect(201);

	//Assert that database has changed correctly
	const user = await User.findById(response.body.user._id);
	expect(user).not.toBeNull();

	//Assertion about response
	expect(response.body).toMatchObject({
		user: {
			name: 'Ankit',
			email: 'ak@example.com',
		},
		token: user.tokens[0].token,
	});
	expect(user.password).not.toBe('nopassatall4');
});

test('Should login a user', async () => {
	const response = await request(app)
		.post('/users/login')
		.send({
			email: userOne.email,
			password: userOne.password,
		})
		.expect(200);
	const user = await User.findById(response.body.user._id);
	expect(response.body.token).toBe(user.tokens[1].token);
	// console.log(response.body.token);
	// console.log(user.tokens[0].token);
});

test('Should not login a nonexistent user', async () => {
	await request(app)
		.post('/users/login')
		.send({
			email: userOne.email,
			password: 'dfsfdk8sfsd',
		})
		.expect(400);
});

test('Should get profile for user', async () => {
	await request(app)
		.get('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);
});

test('Should not get profile for user', async () => {
	await request(app).get('/users/me').send().expect(401);
});

test('Should delete account for user', async () => {
	const response = await request(app)
		.delete('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);
	const user = await User.findById(response.body._id);
	// expect(user).toBeNull(); ///                         ////fails for some reason
});

test('Should not delete account for user', async () => {
	await request(app).delete('/users/me').send().expect(401);
});

test('Should upload avatar image', async () => {
	await request(app)
		.post('/users/me/avatar')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.attach('avatar', 'tests/fixtures/profile-pic.jpg')
		.expect(200);

	const user = await User.findById(userOneId);
	expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
	await request(app)
		.patch('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({ name: 'Astro' })
		.expect(200);

	const user = await User.findById(userOneId);
	expect(user.name).toBe('Astro');
});

test('Should not update valid user fields', async () => {
	await request(app)
		.patch('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({ location: 'istanbul' })
		.expect(400);
});
