const express = require("express");
const router = express.Router();

const posts = require("../data/posts");
const users = require("../data/users");
const comments = require("../data/comments");
const error = require("../utilities/error");

router
    .route("/")
    .get((req, res, next) => {
        const { userId } = req.query;
        //console.log("Received userId:", userId);    
        let filteredPosts;
        if (userId) {
            filteredPosts = posts.filter(post => post.userId == userId);
            if (filteredPosts.length === 0) {
                return res.json({ message: "No posts found for this user" });
            }
        } else {
            filteredPosts = posts;
        }
        res.json({ posts: filteredPosts });
    })
    .post((req, res, next) => {
        if (req.body.userId && req.body.title && req.body.content) {
            const post = {
                id: posts[posts.length - 1].id + 1,
                userId: req.body.userId,
                title: req.body.title,
                content: req.body.content,
            };

            posts.push(post);
            res.json(posts[posts.length - 1]);
        } else next(error(400, "Insufficient Data"));
    });

router
    .route("/:id")
    .get((req, res, next) => {
        const post = posts.find((p) => p.id == req.params.id);

        const links = [
            {
                href: `/${req.params.id}`,
                rel: "",
                type: "PATCH",
            },
            {
                href: `/${req.params.id}`,
                rel: "",
                type: "DELETE",
            },
        ];

        if (post) res.json({ post, links });
        else next();
    })
    .patch((req, res, next) => {
        const post = posts.find((p, i) => {
            if (p.id == req.params.id) {
                for (const key in req.body) {
                    posts[i][key] = req.body[key];
                }
                return true;
            }
        });

        if (post) res.json(post);
        else next();
    })
    .delete((req, res, next) => {
        const post = posts.find((p, i) => {
            if (p.id == req.params.id) {
                posts.splice(i, 1);
                return true;
            }
        });

        if (post) res.json(post);
        else next();
    });


// GET /posts/:id/comments, 
//get all comments for a specific postId
router.get("/:id/comments", (req, res) => {
    const { id } = req.params; // Extract post id from route parameter

    const filteredComments = comments.filter(comment => comment.postId == id);
    if (filteredComments.length === 0) {
        return res.json({ message: "No comments found for this post" });
    }
    res.json({ comments: filteredComments });
});



module.exports = router;
