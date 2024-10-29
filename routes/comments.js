const express = require("express");
const router = express.Router();

//import data
const comments = require('../data/comments');
const users = require("../data/users");
const posts = require("../data/posts");

// GET all comments
//router.get("/", (req, res) => {
//    try {
//        res.json(comments);
//    } catch (error) {
//        res.status(500).json({ error: "Error fetching comments" });
//    }
//});

// GET comment by id
router.get("/:id", (req, res) => {
    try {
        const comment = comments.find(c => c.id === parseInt(req.params.id));
        if (!comment) {
            return res.status(404).json({ error: "comment not found" });
        }
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: "Error fetching comment" });
    }
});

//POST create new comment
router.post("/", (req, res) => {
    try {
        const { postId, userId, content } = req.body;
        if (!postId || !userId || !content) {
            return res.status(400).json({
                error: "Missing required fields",
                required: ["userId", "title", "content"]
            });
        }
        const newComment = {
            id: comments.length > 0 ? Math.max(...comments.map(u => u.id)) + 1 : 1,
            postId: postId,
            userId: userId,
            content: content.trim()
        };
        comments.push(newComment);
        res.status(201).json(newComment);
    } catch (error) {
        console.error("Comment creation error:", error);
        res.status(500).json({ error: "Error creating comment" });
    }
});

// PUT update comment
router.put("/:id", (req, res) => {
    try {
        const { content } = req.body;
        const commentId = parseInt(req.params.id);

        const commentIndex = comments.findIndex(c => c.id === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ error: "Comment not found" });
        }
        // Update only provided fields        
        if (content) comments[commentIndex].content = content.trim();
        res.json(comments[commentIndex]);
    } catch (error) {
        res.status(500).json({ error: "Error updating comment" });
    }
});

// DELETE comment
router.delete("/:id", (req, res) => {
    try {
        const commentId = parseInt(req.params.id);
        const commentIndex = comments.findIndex(c => c.id === commentId);

        if (commentIndex === -1) {
            return res.status(404).json({ error: "Comment not found" });
        }
        //deleting one element
        const deletedComment = comments.splice(commentIndex, 1);
        res.json({ message: "comment deleted successfully", comment: deletedComment[0] });
    } catch (error) {
        res.status(500).json({ error: "Error deleting comment" });
    }
});


//GET /comments?userId=<VALUE>
//GET /comments?postId=<VALUE>
//retrieve all comments with the specified userId, postId.
router.get("/", (req, res, next) => {
    const { userId, postId } = req.query;
    let filteredcomments = comments;

    // Filter by userId if provided
    if (userId) {
        filteredcomments = filteredcomments.filter(comment => comment.userId == userId);
        if (filteredcomments.length === 0) {
            return res.json({ message: "No comments found for this userId" });
        }
    }
    // Filter by postId if provided
    if (postId) {
        filteredcomments = filteredcomments.filter(comment => comment.postId == postId);
        if (filteredcomments.length === 0) {
            return res.json({ message: "No comments found for this postId" });
        }
    }
    // Return the filtered comments
    res.json({ comments: filteredcomments });
});







//export comments router
module.exports = router;