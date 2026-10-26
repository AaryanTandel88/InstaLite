
const usersService = require('../services/users.service');

async function create(req, res) {
    const { username, email, fullname, bio } = req.body;

    if (!username || !email || !fullname) {
        return res.status(400).json({
            error: 'username, email and fullname are required'
        });
    }

    try {
        const user = await usersService.createUser({
            username,
            email,
            fullname,
            bio
        });

        res.status(201).json(user);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({
                error: 'username or email already taken'
            });
        }

        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function list(req, res) {
    try {
        const users = await usersService.listUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getOne(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(404).json({ error: 'User not found' });
    }

    try {
        const user = await usersService.getUserById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function update(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(404).json({ error: 'User not found' });
    }

    const data = {};

    if (req.body.fullname !== undefined) {
        data.fullname = req.body.fullname;
    }

    if (req.body.bio !== undefined) {
        data.bio = req.body.bio;
    }

    if (req.body.isPrivate !== undefined) {
        data.isPrivate = req.body.isPrivate;
    }

    try {
        const user = await usersService.updateUser(id, data);
        res.status(200).json(user);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }

        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function remove(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(404).json({ error: 'User not found' });
    }

    try {
        await usersService.deleteUser(id);
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }

        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { create, list, getOne, update, remove };
