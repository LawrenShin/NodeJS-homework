const fs = require('fs');
const csv = require('csvtojson');
const domain = require('domain');

const file = './csv/nodejs-hw1-ex1.csv';
const d = domain.create();

const readable = fs.createReadStream(file);
const writable = fs.createWriteStream('parsed.txt');

d.on('error', e => {
    console.log(e, 'An error occured');
});
d.run(() => readable.pipe(csv()).pipe(writable));
