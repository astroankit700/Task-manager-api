const express = require('express');
const Task = require('../models/task');
const router = new express.Router();
const auth = require('../middleware/auth');

//CREATE TASK
router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id,
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(error);
    }

    // task.save()
    //     .then(() => {
    //         res.status(201).send(task);
    //     })
    //     .catch((error) => {
    //         res.status(400).send(error);
    //     });
});

//READ ALL TASKS
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};

    //completed query may not be given in the query
    if (req.query.completed) {
        // convert string(true) into boolean(true)
        match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');

        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort,
            },
        });

        res.send(req.user.tasks);
    } catch (e) {
        res.send(e).status(500);
    }
});

//READ TASK BY ID
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) return res.status(404).send();

        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }

    // Task.findById(_id)
    //     .then((result) => {
    //         if (!result) return res.status(404).send();

    //         res.send(result);
    //     })
    //     .catch((e) => {
    //         res.status(500).send(e);
    //     });
});

//UPDATE TASK BY ID
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValid = updates.every((update) => allowedUpdates.includes(update));
    if (!isValid) return res.status(400).send({ error: 'Invalid request!' });

    try {
        // const task=await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true});
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!task) return res.status(404).send();

        updates.forEach((update) => (task[update] = req.body[update]));
        await task.save();

        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

//DELETE TASK BY ID
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,
        });
        if (!task) return res.status(404).send();
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;
