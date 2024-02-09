const sqlite3 = require("sqlite3").verbose();
const prompt = require("prompt");

const db = new sqlite3.Database("./db/colorblend.db");

prompt.start();

// prompt.get(["username", "password"], (err, result) => {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   const promptUsername = result.username;
//   const promptPassword = result.password;

//   getUserData(db, (err, rows) => {
//     if (err) {
//       console.error(err);
//       return;
//     }

//     const user = rows.find(({ username }) => username === promptUsername);

//     if (!user) {
//       console.log("Username is not in our database");
//       return;
//     }

//     if (user.password !== promptPassword) {
//       console.log("Password is incorrect!");
//       return;
//     }

//     console.log("Welcome", user.username);
//   });
// });

function getUserData(database, callback) {
  database.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, rows);
  });
}

db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)", (err, rows) =>{
  if(err) {
    console.log(err)
    return
  }

  console.log(rows)
})
