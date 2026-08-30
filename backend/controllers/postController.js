const Post = require("../models/Post");

// GET /api/posts?category=Technology&search=ai
async function getPosts(req, res) {
    try {
        const { category, search } = req.query;

        const query = {};

        if (category && category !== "All") {
            query.category = category;
        }

        if (search) {
            const regex = new RegExp(search, "i"); // case-insensitive
            query.$or = [
                { title: regex },
                { author: regex },
                { category: regex },
                { content: regex }
            ];
        }

        const posts = await Post.find(query).sort({ createdAt: -1 });

        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: "Server error fetching posts", error: err.message });
    }
}

// GET /api/posts/:id
async function getPostById(req, res) {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json(post);
    } catch (err) {
        res.status(500).json({ message: "Server error fetching post", error: err.message });
    }
}

// POST /api/posts
async function createPost(req, res) {
    try {
        const { title, author, category, image, content } = req.body;

        if (!title || !author || !category || !content) {
            return res.status(400).json({ message: "Title, author, category and content are required" });
        }

        const post = await Post.create({ title, author, category, image, content });

        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: "Server error creating post", error: err.message });
    }
}

// PUT /api/posts/:id
async function updatePost(req, res) {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const { title, author, category, image, content } = req.body;

        post.title = title ?? post.title;
        post.author = author ?? post.author;
        post.category = category ?? post.category;
        post.image = image ?? post.image;
        post.content = content ?? post.content;

        const updated = await post.save();

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Server error updating post", error: err.message });
    }
}

// DELETE /api/posts/:id
async function deletePost(req, res) {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        await post.deleteOne();

        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error deleting post", error: err.message });
    }
}

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };
