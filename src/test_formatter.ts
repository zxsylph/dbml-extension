import { format } from './formatter/formatter';
import * as fs from 'fs';
import * as path from 'path';

const samplePath = path.join(__dirname, '../sample.dbml');
const content = fs.readFileSync(samplePath, 'utf-8');

const formatted = format(content);

console.log('--- Original ---');
console.log(content);
console.log('--- Formatted ---');
console.log(formatted);
