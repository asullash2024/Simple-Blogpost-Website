import bodyParser from "body-parser";
import express from "express";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static("public"));

let posts = [];
app.get("/", (req, res) => {
  res.render("index.ejs", { posts: posts });
});

app.get("/home", (req, res) => {
  res.render("index.ejs", { posts: posts });
});
app.get("/create_post", (req, res) => {
  res.render("create_post");
});
let nextId = 1;

app.post("/submit", (req, res) => {
  function generateUniqueId() {
    const newId = nextId;
    nextId++;
    return newId;
  }
  if (req.body.title && req.body.content) {
    let post = {
      id: generateUniqueId(),
      title: req.body.title,
      content: req.body.content,
    };

    posts.push(post);

    res.render("complete_page.ejs");
    console.log(posts.length);
  } else {
    res.render("create_post.ejs", {
      error: "Please fill in both title and content",
    });
  }
});
app.get("/see_more", (req, res) => {
  res.render("all_blogs", { posts: posts });
});
app.post("/delete/:id", (req, res) => {
  let postId = parseInt(req.params.id, 10); // Step 1
  posts = posts.filter((post) => post.id !== postId); // Step 2
  res.redirect("/"); // Step 3
});
app.get("/edit/:id", (req, res) => {
  let postId = parseInt(req.params.id, 10); // Step 1
  const post = posts.find((post) => post.id == postId);
  if (post) {
    res.render("edit_post", { post: post }); // Pass the post to the edit form
  } else {
    res.redirect("/"); // If the post is not found, redirect to the homepage
  }
});
app.post("/edit/:id", (req, res) => {
    let postId = parseInt(req.params.id, 10); // Step 1
    const post = posts.find((post) => post.id == postId);
    if (post) {
        post.title = req.body.title;
        post.content = req.body.content;
        res.redirect("/");
        console.log(post); 
    } else {
      res.redirect("/"); // If the post is not found, redirect to the homepage
    }
  });
app.listen(port, () => {
  console.log(`Server is running on localhost ${port}`);
});
