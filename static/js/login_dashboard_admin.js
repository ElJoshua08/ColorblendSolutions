// login.js
const user = document.getElementById("User");
const password = document.getElementById("Password");

const submitBtn = document.getElementById("SubmitBtn");
const inputs = document.querySelectorAll("input");

// Deco
inputs.forEach((input) => {
  input.addEventListener("mouseleave", (e) => {
    console.log(e.target.parentElement);
    removeActive(e.target.parentElement);
  });

  input.addEventListener("mouseenter", (e) => {
    console.log(e.target.parentElement);
    active(e.target.parentElement);
  });
});

function active(input) {
  input.classList.add("active");
}

function activeSucced(input) {
  input.classList.add("success");
}

function activeError(input) {
  input.classList.add("error");
}

function removeActive(input) {
  input.classList.remove("active");
}

function removeAll(input) {
  input.classList.remove("active");
  input.classList.remove("error");
  input.classList.remove("success");
}

// Request pag  e auth
submitBtn.onclick = async () => manageDataResponse();
window.onkeydown = async (e) => {
  if (e.code == "Enter") {
    manageDataResponse();
  }
};

async function manageDataResponse() {
  const data = await requestAuth();

  if (data) {
    console.log("Data received ", data);

    if (data.status == "fail") {
      alert("User or password is incorrect!");
    }

    if (data.status == "success") {
      let url = data.redirect;

      inputs.forEach((input) => {
        activeSucced(input.parentElement);

        setTimeout(() => {
          window.location.href = url;
        }, 1250);
      });
    }
  }
}

// Send auth request
async function requestAuth() {
  if (!user.value) {
    alert("You must pass in an user");
    return;
  }
  if (!password.value) {
    alert("You must pass in a password");
    return;
  }

  const dataSend = {
    username: user.value,
    password: password.value,
  };

  console.table(dataSend);

  const response = await fetch("/login_admin_dashboard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataSend),
  });

  console.log(response);

  if (!response.ok) {
    console.log("Response not ok");
    return { redirect: "/", status: "fail" };
  }

  try {
    console.log("Data receiv");
    const data = await response.json();

    console.log("data", data);

    if (data.status === "fail") {
      alert(`Error: ${data.message}`);
    }

    return data;
  } catch (error) {
    console.log("an error happened");
    return { redirect: "/", status: "fail" };
  }
}
