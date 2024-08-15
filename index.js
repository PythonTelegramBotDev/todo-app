const express = require('express');
const fs = require('fs-extra');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Get all TODOs
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await fs.readJson('./db.json');
        res.json(todos);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Add a new TODO
app.post('/api/todos', async (req, res) => {
    try {
        const todos = await fs.readJson('./db.json');
        const newTodo = { id: Date.now(), text: req.body.text, completed: false };
        todos.push(newTodo);
        await fs.writeJson('./db.json', todos);
        res.json(newTodo);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update a TODO
app.put('/api/todos/:id', async (req, res) => {
    try {
        const todos = await fs.readJson('./db.json');
        const updatedTodos = todos.map(todo => 
            todo.id === parseInt(req.params.id) ? { ...todo, completed: req.body.completed } : todo
        );
        await fs.writeJson('./db.json', updatedTodos);
        res.json(updatedTodos.find(todo => todo.id === parseInt(req.params.id)));
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete a TODO
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const todos = await fs.readJson('./db.json');
        const filteredTodos = todos.filter(todo => todo.id !== parseInt(req.params.id));
        await fs.writeJson('./db.json', filteredTodos);
        res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
