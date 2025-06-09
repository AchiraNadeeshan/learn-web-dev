const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.get("/", (req, res) => {
  var today = new Date();
  var currentDay = today.getDay();
  var day = "";

  switch (currentDay) {
    case 0:
      day = "Sunday";
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Saturday";
      break;
    default:
      day = "Unknown Day";
      console.log("Error: "+ currentDay);
  }
  res.render("list", { kindOfDay: day });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
