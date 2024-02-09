const login = document.getElementById("Login");
const register = document.getElementById("Register");
const inputDivs = document.querySelectorAll(".inputDiv");
const inputs = document.querySelectorAll("input");

const login_button = login.querySelector(".submitBtn");
const register_button = register.querySelector(".submitBtn");
const remember_me_button = document.getElementById("remember_me");

inputs.forEach((input) => {

  input.addEventListener("mouseenter", (e) => {
    
    input.parentElement.classList.add("active")
  });

  input.addEventListener("mouseleave", (e) => {
    input.parentElement.classList.remove("active")
  });
});

login_button.addEventListener("click", async () => {
  let username = login.querySelector(".username").value;
  let password = login.querySelector(".password").value;

  if (!username || !password) {
    alert("Please all fields");
    return;
  }

  let dataSent = {
    username: username,
    password: password,
    remember_me: remember_me_button.checked,
  };

  console.log(dataSent);

  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataSent),
  });

  const data = await response.json();

  console.log(data);
});

register_button.addEventListener("click", async () => {
  let username = register.querySelector(".username").value;
  let password = register.querySelector(".password").value;
  let confirmPassword = register.querySelector(".confirmPassword").value;

  if (!username || !password || !confirmPassword) {
    alert("All fields are required!");
    return;
  }
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  const response = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username, password: password }),
  });

  const data = await response.json();

  console.log(data);
});
