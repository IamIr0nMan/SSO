const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

const PORT = process.env.PORT || 4001;

app.use(cookieParser);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/user", (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  let data;
  data = fetch("http://localhost:5000/api/auth/userInfo", {
    headers: { Authorization: accessToken },
  })
    .then((response) => response.json())
    .then((responseData) => {
      console.log(responseData);
      return responseData;
    })
    .catch((error) => console.log(error));

  if (data.status === 401) {
    data = fetch("http://localhost:5000/api/auth/userInfo", {
      headers: { Authorization: refreshToken },
    })
      .then((response) => response.json())
      .then((responseData) => responseData)
      .catch((error) => console.log(error));
  }

  if (data.status === 401) {
    res.redirect(
      "http://localhost:5000/login?redirectionURL=http://localhost:3000"
    );
  }

  console.log(data);
});

app.listen(PORT, () =>
  console.log(`Server Started! Access it on http://localhost:${PORT}/`)
);
