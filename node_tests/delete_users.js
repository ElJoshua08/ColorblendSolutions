const sqlite3 = require("sqlite3").verbose();

// Open SQLite database
const db = new sqlite3.Database("../db/colorblend.db");

// Function to delete all users
db.run(`DELETE FROM users`, function (err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`All users have been deleted`);
});

db.run(`DROP TABLE IF EXISTS users`, function (err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Users table has been deleted`);
});
