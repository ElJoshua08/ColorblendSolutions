const sqlite3 = require("sqlite3").verbose();

// Open SQLite database
const db = new sqlite3.Database("../db/colorblend.db");

// List of first names and last names
const firstNames = [
  // English
  "James",
  "John",
  "Robert",
  "Michael",
  "William",
  "David",
  "Richard",
  "Joseph",
  "Thomas",
  "Charles",
  "Mary",
  "Patricia",
  "Jennifer",
  "Linda",
  "Elizabeth",
  "Barbara",
  "Susan",
  "Jessica",
  "Sarah",
  "Karen",
  // Spanish
  "Carlos",
  "Manuel",
  "Juan",
  "José",
  "Francisco",
  "David",
  "Miguel",
  "Javier",
  "Jorge",
  "Luis",
  "Ana",
  "María",
  "Isabel",
  "Laura",
  "Carmen",
  "Elena",
  "Sara",
  "Nuria",
  "Lucía",
  "Rosa",
];

const lastNames = [
  // English
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Miller",
  "Davis",
  "Garcia",
  "Rodriguez",
  "Martinez",
  "Wilson",
  "Anderson",
  "Taylor",
  "Thomas",
  "Hernandez",
  "Moore",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  // Spanish
  "González",
  "Rodríguez",
  "Fernández",
  "López",
  "Martínez",
  "Sánchez",
  "Pérez",
  "Gómez",
  "Díaz",
  "Herrera",
  "Álvarez",
  "Romero",
  "Muñoz",
  "Jiménez",
  "Navarro",
  "Ruíz",
  "Molina",
  "Serrano",
  "Ramírez",
  "Ortega",
];

// Function to generate a random password
function generateRandomPassword(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Function to add users to the database
function addUsers() {
  for (let i = 0; i < 50; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
    const password = generateRandomPassword(10);

    db.run(
      `INSERT INTO users (username, firstname, lastname, password) VALUES (?, ?, ?, ?)`,
      [username, firstName, lastName, password],
      function (err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`A user with ID ${this.lastID} has been added`);
      }
    );
  }
}

// Create users table if not exists
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT,
        firstname TEXT,
        lastname TEXT,
        password TEXT
    )`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Users table created successfully");
      // Add users after table creation
      addUsers();
    }
  );
});
