const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {

    var today = new Date();

    if (today.getDay() === 6 || today.getDay() === 0) {
        res.send("/weekend.html");
    }else {
        res.send("/weekday.html");
    }



});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});