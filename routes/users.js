const express = require("express");
const router = express.Router();

const users = require("../data/users");
const posts = require("../data/posts");
const comments = require("../data/comments");
const error = require("../utilities/error");

router
    .route("/")
    .get((req, res) => {
        const links = [
            {
                href: "users/:id",
                rel: ":id",
                type: "GET",
            },
        ];

        res.json({ users, links });
    })
    .post((req, res, next) => {
        if (req.body.name && req.body.username && req.body.email) {
            if (users.find((u) => u.username == req.body.username)) {
                next(error(409, "Username Already Taken"));
            }

            const user = {
                id: users[users.length - 1].id + 1,
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
            };

            users.push(user);
            res.json(users[users.length - 1]);
        } else next(error(400, "Insufficient Data"));
    });

router
    .route("/:id")
    .get((req, res, next) => {
        const user = users.find((u) => u.id == req.params.id);

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

        if (user) res.json({ user, links });
        else next();
    })
    .patch((req, res, next) => {
        const user = users.find((u, i) => {
            if (u.id == req.params.id) {
                for (const key in req.body) {
                    users[i][key] = req.body[key];
                }
                return true;
            }
        });

        if (user) res.json(user);
        else next();
    })
    .delete((req, res, next) => {
        const user = users.find((u, i) => {
            if (u.id == req.params.id) {
                users.splice(i, 1);
                return true;
            }
        });

        if (user) res.json(user);
        else next();
    });


//retrieve all posts by a specific user
router.get("/:id/posts", (req, res, next) => {
    const userPosts = posts.filter(post => post.userId == req.params.id);

    if (userPosts.length > 0) {
        res.json({ userId: req.params.id, posts: userPosts });
    } else {
        next(error(404, "No posts found for this user"));
    }
});


////GET /users/:id/comments
////Retrieves comments made by the user with the specified id.
//router.get("/:id/comments", (req, res) => {
//    const { id } = req.params; // Extract post id from route parameter

//    const filteredComments = comments.filter(comment => comment.userId == id);
//    if (filteredComments.length === 0) {
//        return res.json({ message: "No comments found for this post" });
//    }
//    res.json({ comments: filteredComments });
//});


//GET /users/:id/comments?postId=<VALUE>
//Retrieves comments made by the user with the specified id on the post with the specified postId.
router.get("/:id/comments", (req, res) => {
    const { id } = req.params;        // Extract post id from route parameter
    const { postId } = req.query;      // Extract userId from query parameter

    // Filter comments by userId
    let filteredComments = comments.filter(comment => comment.userId == id);

    // Further filter by postId if provided
    if (postId) {
        filteredComments = filteredComments.filter(comment => comment.postId == postId);
    }
    // If no comments are found, return a message
    if (filteredComments.length === 0) {
        return res.json({ message: "No comments found for the specified criteria." });
    }

    res.json({ comments: filteredComments });
});









module.exports = router;
