const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("../db/colorblend.db")

db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, fistname TEXT, lastname TEXT, password TEXT)", (err) => {
  if(err) {
    console.log(err)
    return
  }
})