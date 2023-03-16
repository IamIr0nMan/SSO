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
      console.error("Error:", error);
    });
}

function register() {}

function forgotPassword() {}
