// All modules needed
const express = require("express");
const path = require("path");
const ActiveDirectory = require("activedirectory");
const bodyParser = require("body-parser");
const session = require("express-session");
const randToken = require("rand-token");
const sqlite3 = require("sqlite3").verbose();

// App init
const app = express();
const port = process.env.PORT || 80;

// App config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "static")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Añadir el middleware para parseo de JSON

// Set constant to store tokens
const tokens = [];

// Configuración de middleware de sesiones
app.use(
  session({
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: true,
  })
);

// Configuración de Active Directory
const adConfig = {
  url: "ldap://server.server.com", // Reemplaza con la URL de tu servidor LDAP
  baseDN: "DC=server,DC=com", // Reemplaza con la baseDN de tu dominio
};

const ad = new ActiveDirectory(adConfig);

// Database init
const db = new sqlite3.Database("./db/colorblend.db");

// Landing page (pagina de inico)
app.get("/", (req, res) => {
  res.render("landing");
});

// About page (Sobre nosotros)
app.get("/about_us", (req, res) => {
  res.render("about_us");
});

// Login into the page
app.get("/login", (req, res) => {
  res.render("login");
});

// Login logic
app.post("/login", (req, res) => {
  // Login logic
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      res.send({ status: "fail", message: err });
      return;
    }

    let user = rows.find((user) => user.username === req.body.username);

    if (!user) {
      res.send({ status: "fail", message: "User not found!" });
      return;
    }

    if (req.body.password !== user.password) {
      res.send({ status: "fail", message: "Wrong password!" });
      return;
    }

    res.send({ status: "succes", redirect: "/" });
  });
});

//
app.post("/register", (req, res) => {
  if (
    !req.body.firstname ||
    req.body.lastname ||
    !req.body.username ||
    !req.body.password
  ) {
    res.send({ status: "fail", message: "User or password not found!" });
    return;
  }

  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let username = req.body.username;
  let password = req.body.password;

  db.run(
    `INSERT INTO users (username, firstname, lastname, password) VALUES (?, ?, ?, ?)`,
    [username, firstname, lastname, password],
    function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`A user with ID ${this.lastID} has been added`);
    }
  );
});

app.get("/get_users", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      res.send({ status: "fail", message: err });
      return;
    }
    res.send({ status: "success", users: rows });
  });
});

// Login to dashboard, you need and auth from the ac
app.get("/login_admin_dashboard", (req, res) => {
  res.render("login_dashboard_admin");
});

function getTotalUsers() {
  db.get(`SELECT COUNT(*) AS total_users FROM users`, function (err, row) {
    if (err) {
      return console.error(err.message);
    }

    return row.total_users;
  });
}

app.get("/admin_dashboard", (req, res) => {
  let total_users = getTotalUsers();

  // Verificar si el usuario está autenticado
  if (validateToken(req.session.token)) {
    res.render("admin_dashboard", { username: req.session.username });
  } else {
    // Si no está autenticado, redirigir a la página de inicio de sesión
    res.send({
      redirect: "/",
      status: "fail",
      message: `Not auth ${req.session.token}`,
    });
  }
});

// Manejar la autenticación al recibir el formulario
app.post("/login_admin_dashboard", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Verificar las credenciales contra Active Directory
  ad.authenticate(username, password, (err, auth) => {
    if (err) {
      console.error("Error de autenticación:", err);
      res.render("error", { message: err.message });
      return;
    }

    // Send error if auth not successful
    if (!auth) {
      res.send({ redirect: "/", status: "fail" });
    }

    // Autenticación exitosa, establecer una variable de sesión
    let token = createToken();
    req.session.token = token;
    tokens.push(token);

    req.session.authenticated = true;
    req.session.username = username;

    // Redirigir al usuario a la página protegida
    console.log(token, tokens);
    res.send({ redirect: "/admin_dashboard", status: "success", token });
  });
});

// Utils
function createToken() {
  return randToken.generate(16);
}

function validateToken(token) {
  return tokens.includes(token);
}

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
