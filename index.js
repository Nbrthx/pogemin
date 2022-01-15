const express = require("express")
const path = require("path")
const pg = require("ejs")

const port = process.env.PORT || 3000

var app = express()

app.use(express.static(path.join(__dirname, "/public")))
app.set("views",path.join(__dirname,"/views"))
app.set("view engine", "ejs")

app.get("/", (req, res) => {
  res.render("index")
}

app.listen(port, () => {
  console.log("Listen on port "+port)
}
