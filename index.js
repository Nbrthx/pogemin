const express = require("express")
const path = require("path")
const { Pool, Client } = require("pg")
const cookiep = require("cookie-parser")
const bodyp = require("body-parser")

const port = process.env.PORT || 3000

var app = express()
var que = ""
var rlog = ""

app.use(express.static(path.join(__dirname, "/public")))
app.use(cookiep("secret"))
app.use(bodyp.urlencoded({ extended: true }))
app.use(bodyp.json())
app.set("views", path.join(__dirname,"/views"))
app.set("view engine", "ejs")

app.get("/", (req, res) => {
  var db = req.signedCookies.db
  if(db)
    res.render("index", { rlog: rlog, que: que })
  else res.redirect("connect")
})
app.get("/ui", (req, res) => {
  res.render("ui")
})
app.get("/connect", (req, res) => {
  var db = req.signedCookies.db
  if(!db)
    res.redirect("index")
  else res.render("connect")
})
app.post("/do", (req, res) => {
  que = (req.body.query).replace(/\"/g, "'")
  var pool = new Pool(req.signedCookies.db)

  pool.query(que, (err, row) => {
    rlog = JSON.stringify(row, null, 2)
    res.redirect("/")
  })
})
app.post("/conn", (req, res) => {
  var dbhost = req.body.dbhost
  var dbport = req.body.dbport
  var dbuser = req.body.dbuser
  var dbpass = req.body.dbpass
  var dbname = req.body.dbname

 var conf = {
    user: dbuser,
    host: dbhost,
    database: dbname,
    password: dbpass,
    port: dbport,
    ssl: { rejectUnauthorized: false }
  }

  var pool = new Pool(conf)

  pool.query("SELECT NOW()", (err, row) => {
    if(!err){
      res.cookie("db", conf, { signed: true })
      res.redirect("/")
    }else{
      res.redirect("connect")
      pool.end()
    }
  })
})
app.get("/disconnect", (req, res) => {
  res.cookie("db",null)
  res.redirect("/")
})

app.listen(port, () => {
  console.log("Listen on port "+port)
})
