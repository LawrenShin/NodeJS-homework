import * as fs from "fs";
import csv from 'csvtojson';
import {file} from "./const_3";

const readable = fs.createReadStream(file);
const writable = fs.createWriteStream('parsed.txt');

readable
    .pipe(csv())
    .pipe(writable);