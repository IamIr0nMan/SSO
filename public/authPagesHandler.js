const { response } = require("express");

function redirectToRegister() {
  location.href = "/register";
}

function redirectToLogin() {
  location.href = "/login";
}

function redirectToForgotPassword() {
  location.href = "/forgotPassword";
}

function signIn() {
  const email = document.getElementById("floatingEmail").value;
  const password = document.getElementById("floatingPassword").value;
  const errorMsg = document.getElementById("errorMsg");
  const data = { email, password };

  fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status == 404) {
        errorMsg.innerText =
          "This user does not exist, redirecting to signup...";
        setTimeout(() => {
          location.href = "/register";
        }, 3000);
      } else if (response.status == 401) {
        errorMsg.innerText = "Password is incorrect, try again...";
      } else if (response.status != 200) {
        errorMsg.innerText = "There is an unexpected error, try again later...";
        setTimeout(() => {
          location.reload();
        }, 3000);
      }

      return response.json();
    })
    .then((data) => {
      if (response.status == 200) {
        location.href = data.redirectionURL;
      }
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
}

function register() {
  const fname = document.getElementById("floatingFirstName").value;
  const lname = document.getElementById("floatingLastName").value;
  const email = document.getElementById("floatingEmail").value;
  const password = document.getElementById("floatingPassword").value;
  const dob = document.getElementById("datepicker").value;
  const errorMsg = document.getElementById("errorMsg");
  const data = { fname, lname, email, password, dob };

  fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status == 422) {
        errorMsg.innerText =
          "This user already exist, redirecting to sign in page...";
        setTimeout(() => {
          location.href = "/login";
        }, 3000);
      } else if (response.status != 200) {
        errorMsg.innerText = "There is an unexpected error, try again later...";
        setTimeout(() => {
          location.reload();
        }, 3000);
      }

      return response.json();
    })
    .then((data) => {
      if (response.status == 200) {
        location.href = data.redirectionURL;
      }
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
}

function forgotPassword() {}
