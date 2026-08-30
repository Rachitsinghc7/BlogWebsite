const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true
        },
        author: {
            type: String,
            required: [true, "Author name is required"],
            trim: true
        },
        category: {
            type: String,
            required: true,
            enum: ["Technology", "Programming", "Lifestyle", "Education"]
        },
        image: {
            type: String,
            default: ""
        },
        content: {
            type: String,
            required: true
        }
    },
    { timestamps: true } // adds createdAt / updatedAt automatically
);

module.exports = mongoose.model("Post", postSchema);
