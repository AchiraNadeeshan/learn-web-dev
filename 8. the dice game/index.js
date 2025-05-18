// dice1
var randomNumber1 = Math.floor(Math.random() * 6) + 1;   //random number from 1-6

var randomDiceImage = "dice" + randomNumber1 + ".png";  //dice1.png - dice6.png

var randomImageSrc = "images/" + randomDiceImage;   //images/dice1.png...

var img1 = document.querySelectorAll("img")[0];
img1.setAttribute("src", randomImageSrc);

//dice2
var randomNumber2 = Math.floor(Math.random() * 6) + 1;

var randomDiceImage = "dice" + randomNumber2 + ".png";

var randomImageSrc = "images/" + randomDiceImage;

var img2 = document.querySelectorAll("img")[1];
img2.setAttribute("src", randomImageSrc);

//winner
if (randomNumber1 > randomNumber2) {
    document.querySelector("h1").innerHTML = "Play 1 wins!";
} else if (randomNumber1 < randomNumber2) {
    document.querySelector("h1").innerHTML = "Play 2 wins!";
} else {
    document.querySelector("h1").innerHTML = "Draw!";
}