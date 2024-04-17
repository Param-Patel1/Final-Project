const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getCollection = () => {
    const client = getConnectedClient();
    const collection = client.db("todosdb").collection("todos");
    return collection;
}

router.get("/todos", async (req, res) => {
    const collection = getCollection();
    const todos = await collection.find({}).toArray();

    res.status(200).json(todos);
});
router.post("/todos", async (req, res) => {
    const collection = getCollection();
    const { todo, dueDate } = req.body;

    if (!todo || typeof todo !== "string") {
        return res.status(400).json({ error: "Todo must be a non-empty string" });
    }

    if (!dueDate || !isValidDate(dueDate)) {
        return res.status(400).json({ error: "Invalid due date format. Please provide a valid date string in ISO format (e.g., YYYY-MM-DD)" });
    }

    if (new Date(dueDate) < new Date()) {
        return res.status(400).json({ error: "Due date cannot be in the past" });
    }

    const existingTodo = await collection.findOne({ todo });
    if (existingTodo) {
        return res.status(400).json({ error: "A todo with the same name already exists" });
    }

    try {
        const newTodo = await collection.insertOne({ todo, dueDate: new Date(dueDate), status: false });
        res.status(201).json({ todo, dueDate: new Date(dueDate), status: false, _id: newTodo.insertedId });
    } catch (error) {
        console.error("Error creating todo:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}

router.delete("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);

    const deletedTodo = await collection.deleteOne({ _id });

    res.status(200).json(deletedTodo);
});

router.put("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const { status } = req.body;

    if (typeof status !== "boolean") {
        return res.status(400).json({ mssg: "invalid status"});
    }

    const updatedTodo = await collection.updateOne({ _id }, { $set: { status: !status } });

    res.status(200).json(updatedTodo);
});

module.exports = router;