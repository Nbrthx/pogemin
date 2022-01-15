const express = require("express")
const path = require("path")
const { Pool, Client } = require("pg")
const cookiep = require("cookie-parser")
const bodyp = require("body-parser")

const port = process.env.PORT || 3000

var app = express()
var pool

app.use(express.static(path.join(__dirname, "/public")))
app.use(cookiep("secret"))
app.use(bodyp.urlencoded({ extended: true }))
app.use(bodyp.json())
app.set("views", path.join(__dirname,"/views"))
app.set("view engine", "ejs")

app.get("/", (req, res) => {
  var db = res.signedCookies.db
  if(db) res.render("index")
  else res.render("connect")
})
app.post("/do", (req, res) => {
  
}
app.post("/conn", (req, res) => {
  var dbhost = req.body.dbhost
  var dbport = req.body.dbport
  var dbuser = req.body.dbuser
  var dbpass = req.body.dbpass
  var dbname = req.body.dbname

  pool = new Pool({
    user: dbuser,
    host: dbhost,
    database: dbname,
    password: dbpass,
    port: dbport,
    ssl: { rejectUnauthorized: false }
  })
}

app.listen(port, () => {
  console.log("Listen on port "+port)
})
