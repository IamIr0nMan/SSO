function getQueryString() {
  const queryString = location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("redirectionURL");
}

function redirectToRegister() {
  location.href = `/register?redirectionURL=${getQueryString()}`;
}

function redirectToLogin() {
  location.href = `/login?redirectionURL=${getQueryString()}`;
}

function redirectToForgotPassword() {
  location.href = `/forgotPassword?redirectionURL=${getQueryString()}`;
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
          location.href = `/register?redirectionURL=${getQueryString()}`;
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
        location.href = getQueryString();
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
          location.href = `/login?redirectionURL=${getQueryString()}`;
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
        location.href = getQueryString();
      }
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
}

function forgotPassword() {
  const email = document.getElementById("floatingEmail").value;
  const newPassword = document.getElementById("floatingPassword").value;
  const dob = document.getElementById("datepicker").value;
  const errorMsg = document.getElementById("errorMsg");
  const data = { email, newPassword, dob };

  fetch("http://localhost:3000/auth/forgotPassword", {
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
          location.href = `/register?redirectionURL=${getQueryString()}`;
        }, 3000);
      } else if (response.status == 401) {
        errorMsg.innerText = "Date of Birth is incorrect, try again...";
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
        location.href = `/login?redirectionURL=${getQueryString()}`;
      }
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
}
