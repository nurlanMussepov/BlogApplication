import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

//Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//Posts array and postId counter before using them
const posts = [];
let postId = 0;

class Post {
  constructor(id, title, content) {
    this.id = id;
    this.title = title;
    this.content = content;
  }
}

// Basic get routes

app.get("/", (req, res) => {
  res.render("main.ejs", { posts: posts });
});

app.get("/create", (req, res) => {
  res.render("create.ejs");
});

//View specific post
app.get("/view/:id", (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (post) {
    res.render("view.ejs", { post });
  } else {
    res.status(404).send("Post not found");
  }
});

//Create new psot
app.post("/create", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const newPost = new Post(postId++, title, content);
  posts.push(newPost);
  res.redirect("/");
});

//Delete post
app.post("/delete/:id", (req, res) => {
  const idToDelete = parseInt(req.params.id);
  const index = posts.findIndex(post => post.id === idToDelete);
  if (index !== -1) {
    posts.splice(index, 1);
  }
  res.redirect("/");
});

// Edit page
app.get("/edit/:id", (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (post) {
    res.render("edit.ejs", { post });
  } else {
    res.status(404).send("Post not found");
  }
});

// Update post
app.post("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find(p => p.id === id);
  if (post) {
    post.title = req.body.title;
    post.content = req.body.content;
    res.redirect("/view/" + id);
  } else {
    res.status(404).send("Post not found");
  }
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
