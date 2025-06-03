const express = require("express");
const port = 3000;
const https = require("https");
const app = express();

app.get("/", (req, res) => {
  const url =
    "https://api.openweathermap.org/data/2.5/weather?lat=6.927079&lon=79.861244&appid=1643d363b47aca96cb2008a62a1a9881";

  https.get(url, (response) => {
    console.log(response);
  });
  res.send("Weather data fetched successfully. Check console for details.");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
