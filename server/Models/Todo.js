const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({

    todo: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        validate: {
            validator: function(value) {
                // Check if due date is in the future
                return value && value > new Date();
            },
            message: "Due date must be in the future"
        }
    }
});

const Todo = mongoose.model("todos", todoSchema);

module.exports = Todo;