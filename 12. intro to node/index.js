// import superheroes from 'superheroes';

// superheroes;
// randomSuperhero();

// console.log(mySuperheroName);

// var superheroes = require('superheroes');
// console.log(superheroes.random());

// const randomSuperhero = require('superheroes');

// console.log(randomSuperhero());

const superheroes = require('superheroes');

// If `superheroes` has named exports in an ES Module,
// you'll access them like this:
const { randomSuperhero } = superheroes;

console.log(randomSuperhero());



const {randomSuperhero} = require('superheroes');

console.log(randomSuperhero());