const fs = require('fs');
const csv = require('csvtojson');

const file = './csv/nodejs-hw1-ex1.csv';

const readable = fs.createReadStream(file);
const writable = fs.createWriteStream('parsed.txt');


readable
    .pipe(csv())
    .pipe(writable);