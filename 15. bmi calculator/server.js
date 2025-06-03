const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/bmicalculator", (req, res) => {
  res.sendFile(__dirname + "/bmiCalculator.html");
});

app.post("/bmicalculator", (req, res) => {
  const weight = parseFloat(req.body.weight);
  const height = parseFloat(req.body.height);
  const bmi = weight / (height * height) * 10000; // BMI formula: weight (kg) / (height (cm) * height (cm)) * 10000
  let category = "";

  if (bmi < 16) {
    category = "Severe Thinness";
  } else if (bmi >= 16 && bmi < 17) {
    category = "Moderate Thinness";
  } else if (bmi >= 17 && bmi < 18.5) {
    category = "Mild Thinness";
  } else if (bmi >= 18.5 && bmi < 25) {
    category = "Normal";
  } else if (bmi >= 25 && bmi < 30) {
    category = "Overweight";
  } else if (bmi >= 30 && bmi < 35) {
    category = "Obese Class I";
  } else if (bmi >= 35 && bmi < 40) {
    category = "Obese Class II";
  } else {
    category = "Obese Class III";
  }

  res.send(`Your BMI is ${bmi.toFixed(2)}. Category: ${category}`);
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
