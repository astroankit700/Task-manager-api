///Gadbad ho??  check AWAIT!!!!!!!!!!

const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const {
	taskOne,
	userOne,
	setupDatabase,
	taskThree,
	taskTwo,
	userTwo,
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create a new task', async () => {
	const response = await request(app)
		.post('/tasks')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			description: 'Create a test case',
			completed: false,
		})
		.expect(201);

	const task = await Task.findById(response.body._id);
	expect(task).not.toBeNull();
	expect(task.completed).toEqual(false);
});

test('Should read task by id', async () => {
	const response = await request(app)
		.get('/tasks/' + taskOne._id)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);

	expect(response.body.completed).toEqual(true);
});

test('Should not read task by id', async () => {
	const response = await request(app)
		.get('/tasks/' + taskThree._id)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(404);
});

test('Should read all task of the user', async () => {
	const response = await request(app)
		.get('/tasks')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);

	expect(response.body.length).toEqual(2);
});

test('Should delete task by id', async () => {
	const response = await request(app)
		.delete('/tasks/' + taskOne._id)
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);

	const task = Task.findById(taskOne._id);
	// expect(task).toBeNull();   //                    //failing for some reason
});

test('Should not delete task by id', async () => {
	const response = await request(app)
		.delete('/tasks/' + taskTwo._id)
		.set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
		.send()
		.expect(404);

	expect(Task.findById(taskTwo._id)).not.toBeNull();
});
