const express = require("express");
const port = 3000;
const https = require("https");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html"); // Serve the index.html file
});

// Handle POST requests to the root URL
app.post("/", (req, res) => {
  console.log();
  console.log();

  const lat = req.body.lat; // Latitude for Colombo
  const lon = req.body.lon; // Longitude for Colombo
  const apiKey = "1643d363b47aca96cb2008a62a1a9881"; // Your OpenWeatherMap API key
  // Construct the URL for the OpenWeatherMap API
  const url =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    apiKey;

  https.get(url, (response) => {
    console.log(response.statusCode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp; // Go into the object of weatherData-->main-->temp and get the Temperature in Kelvin
      const weatherDescription = weatherData.weather[0].description; // Get the weather description
      const icon = weatherData.weather[0].icon; // Get the icon code
      const cityName = weatherData.name; // Get the city name

      res.write(
        "<h1>The temperature in " + cityName + " is " +
          temp +
          " Kelvin and the weather is " +
          weatherDescription +
          "</h1>"
      );
      res.write(
        "<img src='http://openweathermap.org/img/wn/" + icon + "@2x.png'>"
      );
      res.send(); // Send the response to the client
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
