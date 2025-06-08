const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us4.api.mailchimp.com/3.0/lists/056258d44e";
  const options = {
    method: "POST",
    auth: "anystring:aa02f52444be91e977be3215ccd6f673-us4",
  };

  const request = https.request(url, options, function (response) {
    response.statusCode === 200
      ? res.sendFile(__dirname + "/success.html")
      : res.sendFile(__dirname + "/failure.html");
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
